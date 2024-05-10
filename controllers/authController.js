// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function signup(req, res) {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Hashing de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con la contraseña hasheada
    const newUser = new User({
      username,
      password: hashedPassword // Almacenar la contraseña hasheada en la base de datos
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  login,
  signup
};
