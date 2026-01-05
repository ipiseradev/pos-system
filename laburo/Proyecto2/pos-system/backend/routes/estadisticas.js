const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET - Estadísticas generales
router.get('/', (req, res) => {
    try {
        // Total de ventas
        const ventasHoy = db.prepare(`
            SELECT COUNT(*) as cantidad, COALESCE(SUM(total), 0) as total
            FROM ventas WHERE DATE(fecha) = DATE('now')
        `).get();

        const ventasMes = db.prepare(`
            SELECT COUNT(*) as cantidad, COALESCE(SUM(total), 0) as total
            FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', 'now')
        `).get();

        const ventasTotal = db.prepare(`
            SELECT COUNT(*) as cantidad, COALESCE(SUM(total), 0) as total
            FROM ventas
        `).get();

        // Productos
        const totalProductos = db.prepare('SELECT COUNT(*) as total FROM productos').get();
        const productosBajoStock = db.prepare('SELECT COUNT(*) as total FROM productos WHERE stock < 10').get();

        // Productos más vendidos
        const productosTop = db.prepare(`
            SELECT nombre, SUM(cantidad) as vendidos, SUM(precio * cantidad) as ingresos
            FROM venta_items
            GROUP BY nombre
            ORDER BY vendidos DESC
            LIMIT 5
        `).all();

        // Ventas por método de pago
        const ventasPorMetodo = db.prepare(`
            SELECT metodo_pago, COUNT(*) as cantidad, SUM(total) as total
            FROM ventas
            GROUP BY metodo_pago
        `).all();

        // Últimas 5 ventas
        const ultimasVentas = db.prepare(`
            SELECT * FROM ventas ORDER BY fecha DESC LIMIT 5
        `).all();

        res.json({
            ventasHoy,
            ventasMes,
            ventasTotal,
            totalProductos: totalProductos.total,
            productosBajoStock: productosBajoStock.total,
            productosTop,
            ventasPorMetodo,
            ultimasVentas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

module.exports = router;