const User = require('../models/User');

const userController = {
    
    getAllUsers: async (req, res) => {
        try {
            // Get all users
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;