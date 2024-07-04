const bcrypt = require("bcrypt");
const User = require("../modals/users.model");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Addresse mail ou bien mot de passe erroné" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ message: "Addresse mail ou bien mot de passe erroné" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: "authentifié avec succès", user: userObj, token });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", err });
  }
};

const signUpUser = async (req, res) => {
  try {
    const { email, password, role, userName } = req.body;
    console.log("Received signup request for:", { email, role, userName });

    // Check if role is provided and is valid
    if (!role || !["worker", "engineer"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Vous devez choisir un role valide" });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    console.log("Existing user with email:", existingEmail);

    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Un compte avec cette adresse mail existe déjà" });
    }

    // Check for existing username
    const existingUserName = await User.findOne({ userName });
    console.log("Existing user with username:", existingUserName);

    if (existingUserName) {
      return res
        .status(400)
        .json({ message: "Un compte avec ce nom d'utilisateur existe déjà" });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
      role, 
      userName
    });

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Compte créé avec succès", user, token });
  } catch (err) {
    console.error("Error in signUpUser:", err);
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Mot de passe changé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  console.log("Request received for getUsers API");

  try {
    const users = await User.find();
    const userNamesAndEmails = users.map((user) => {
      return { userName: user.userName, email: user.email };
    });
    res.status(200).json(userNamesAndEmails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const DeleteUserByUserNameOrEmail = async (req, res) => {
  console.log("Request received for DeleteUserByUserNameOrEmail API");

  try {
    console.log("req.params:", req.query); 
    const identifier = req.query.identifier;
    console.log("Identifier:", identifier); 

    if (!identifier) {
      return res.status(400).json({ message: "Identifier is required" });
    }

    let query = {};

    // Determine if the identifier is an email or a username
    if (identifier.includes('@')) {
      query.email = identifier;
    } else {
      query.userName = identifier;
    }

    const user = await User.findOne(query);
    console.log("User found", user);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    await User.deleteOne(query);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error("Error in DeleteUserByUserNameOrEmail:", err); // Improved error logging
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginUser, signUpUser, changePassword, getUsers, DeleteUserByUserNameOrEmail };
