const bcrypt = require('bcrypt');
const User = require('../modals/users.model');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Addresse mail ou bien mot de passe erroné' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: 'Addresse mail ou bien mot de passe erroné' });
        }

        res.json({ message: 'Logged in successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', err });
    }
};

const signUpUser = async (req, res) => {
    try {
       const user =  await User.create(req.body)
        res.status(200).json('user created successfully')
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { loginUser, signUpUser };