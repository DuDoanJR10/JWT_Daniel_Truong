const User = require('../models/User');

const userController = {
    // GET: /v1/users/
    getAllUsers: async (req, res) => {
        try {
            // Get all users
            const users = await User.find();
            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err);
        }
    },
    // DELETE: /v1/users/:id
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            return res.status(200).json("Delete success!");
        } catch (err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = userController;