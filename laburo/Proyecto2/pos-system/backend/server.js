const express = require('express');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// RUTAS
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const authRoutes = require('./routes/auth');
const estadisticasRoutes = require('./routes/estadisticas'); // 👈 NUEVO

app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/estadisticas', estadisticasRoutes); // 👈 NUEVO

app.get('/', (req, res) => {
    res.json({ mensaje: '¡Backend del POS funcionando!', version: '1.0.0' });
});

app.listen(PORT, () => {
    console.log(`Servidor backend del POS escuchando en el puerto ${PORT}`);
});