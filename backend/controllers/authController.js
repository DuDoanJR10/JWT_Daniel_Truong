const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fake database
let refreshTokens = [];

const authController = {
    // POST: /v1/auth/register
    registerUser: async (req, res) => {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                admin: req.body?.admin || false,
            });

            // Save to database
            const user = await newUser.save();
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: '20s'
        });
    },
    generateRefreshToken: (user) => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: '7d'
        });
    },
    // POST: /v1/auth/login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Wrong password!");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                // Save refreshToken to cookie
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: "strict" // Prevent attack CSRF 
                })

                const { password, ...others } = user._doc;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // POST: /v1/auth/refresh
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json("You're not authenticated!");
            if (!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh token is invalid!");
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY,
                (err, user) => {
                    if (err) {
                        console.log(err);
                    } else {
                        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

                        const newAccessToken = authController.generateAccessToken(user);
                        const newRefreshToken = authController.generateRefreshToken(user);
                        refreshTokens.push(newRefreshToken);
                        // Save refreshToken to cookie
                        res.cookie("refreshToken", newRefreshToken, {
                            httpOnly: true,
                            secure: false,
                            path: '/',
                            sameSite: "strict" // Prevent attack CSRF 
                        })
                        return res.status(200).json({ accessToken: newAccessToken });
                    }
                }
            )
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // POST: /v1/auth/logout
    userLogout: async (req, res) => {
        try {
            res.clearCookie("refreshToken");
            refreshTokens.filter(token => token !== req.cookies.refreshToken);
            return res.status(200).json("Logout successfully!");
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = authController;
