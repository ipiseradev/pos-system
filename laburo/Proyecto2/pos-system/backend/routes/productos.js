const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET - Obtener todos los productos
router.get('/', (req, res) => {
    const productos = db.prepare('SELECT * FROM productos').all();
    res.json(productos);
});

// GET - Obtener un producto por ID
router.get('/:id', (req, res) => {
    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
});

// POST - Crear un nuevo producto
router.post('/', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;

    const stmt = db.prepare(`
        INSERT INTO productos (nombre, precio, stock, categoria) 
        VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(nombre, precio, stock || 0, categoria || 'General');

    res.status(201).json({
        id: result.lastInsertRowid,
        nombre,
        precio,
        stock: stock || 0,
        categoria: categoria || 'General'
    });
});

// PUT - Actualizar un producto
router.put('/:id', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;

    const stmt = db.prepare(`
        UPDATE productos 
        SET nombre = COALESCE(?, nombre),
            precio = COALESCE(?, precio),
            stock = COALESCE(?, stock),
            categoria = COALESCE(?, categoria)
        WHERE id = ?
    `);

    const result = stmt.run(nombre, precio, stock, categoria, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = db.prepare('SELECT * FROM productos WHERE id = ?').get(req.params.id);
    res.json(producto);
});

// DELETE - Eliminar un producto
router.delete('/:id', (req, res) => {
    const result = db.prepare('DELETE FROM productos WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado' });
});

module.exports = router;