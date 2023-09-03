const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
    registerUser: async(req, res) => {
        try {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed
            });

            // Save to database
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = authController;