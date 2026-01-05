const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET - Obtener todas las ventas
router.get('/', (req, res) => {
    const ventas = db.prepare(`
        SELECT * FROM ventas ORDER BY fecha DESC
    `).all();

    // Para cada venta, obtener sus items
    const ventasConItems = ventas.map(venta => {
        const items = db.prepare(`
            SELECT * FROM venta_items WHERE venta_id = ?
        `).all(venta.id);
        return {...venta, items };
    });

    res.json(ventasConItems);
});

// GET - Obtener una venta por ID
router.get('/:id', (req, res) => {
    const venta = db.prepare('SELECT * FROM ventas WHERE id = ?').get(req.params.id);

    if (!venta) {
        return res.status(404).json({ error: 'Venta no encontrada' });
    }

    const items = db.prepare('SELECT * FROM venta_items WHERE venta_id = ?').all(venta.id);
    res.json({...venta, items });
});

// POST - Registrar una nueva venta
router.post('/', (req, res) => {
    const { items, metodoPago } = req.body;

    // Calcular el total
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    // Insertar la venta
    const ventaStmt = db.prepare(`
        INSERT INTO ventas (metodo_pago, total) VALUES (?, ?)
    `);
    const ventaResult = ventaStmt.run(metodoPago, total);
    const ventaId = ventaResult.lastInsertRowid;

    // Insertar los items de la venta
    const itemStmt = db.prepare(`
        INSERT INTO venta_items (venta_id, producto_id, nombre, precio, cantidad)
        VALUES (?, ?, ?, ?, ?)
    `);

    items.forEach(item => {
        itemStmt.run(ventaId, item.productoId, item.nombre, item.precio, item.cantidad);

        // Actualizar el stock del producto
        db.prepare('UPDATE productos SET stock = stock - ? WHERE id = ?')
            .run(item.cantidad, item.productoId);
    });

    res.status(201).json({
        id: ventaId,
        metodoPago,
        total,
        items
    });
});

// GET - Resumen de ventas del día
router.get('/resumen/hoy', (req, res) => {
    const hoy = new Date().toISOString().split('T')[0];

    const resumen = db.prepare(`
        SELECT 
            COUNT(*) as cantidadVentas,
            COALESCE(SUM(total), 0) as totalVentas
        FROM ventas 
        WHERE DATE(fecha) = DATE('now')
    `).get();

    const ventas = db.prepare(`
        SELECT * FROM ventas WHERE DATE(fecha) = DATE('now')
    `).all();

    res.json({
        fecha: hoy,
        ...resumen,
        ventas
    });
});

// DELETE - Anular una venta
router.delete('/:id', (req, res) => {
    // Primero eliminar los items
    db.prepare('DELETE FROM venta_items WHERE venta_id = ?').run(req.params.id);

    // Luego eliminar la venta
    const result = db.prepare('DELETE FROM ventas WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Venta no encontrada' });
    }

    res.json({ mensaje: 'Venta anulada' });
});

module.exports = router;