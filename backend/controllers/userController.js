const User = require('../models/User');

const userController = {
    // GET: /v1/users/
    getAllUsers: async (req, res) => {
        try {
            // Get all users
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // DELETE: /v1/users/:id
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json("Delete success!");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;