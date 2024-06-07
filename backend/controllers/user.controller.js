const bcrypt = require('bcrypt');
const User = require('../modals/users.model');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '8h' });

        res.json({ message: 'authentifié avec succès' }, user, token);
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', err });
    }
};

const signUpUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if role is provided and is valid
        if (!role || !['worker', 'engineer'].includes(role)) {
            return res.status(400).json({ message: 'Vous devez choisir un role valide' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Un compte avec cette adresse mail existe déjà' });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ email, password: hashedPassword, role });

        // Create a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Compte créé avec succès',user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { loginUser, signUpUser };