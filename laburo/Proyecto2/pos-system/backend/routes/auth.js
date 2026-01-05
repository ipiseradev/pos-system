const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = 'clave_secreta_pos_2024';

// POST - Registrar usuario
router.post('/registro', async(req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const usuarioExiste = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        if (usuarioExiste) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const stmt = db.prepare('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)');
        const result = stmt.run(nombre, email, passwordHash);

        const token = jwt.sign({ id: result.lastInsertRowid, email, nombre }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            mensaje: 'Usuario registrado',
            token,
            usuario: { id: result.lastInsertRowid, nombre, email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar' });
    }
});

// POST - Login
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;