<div align="center">

# 🛒 Sistema POS - Punto de Venta

### Sistema completo de gestión comercial con inventario, ventas y análisis estadístico en tiempo real

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</div>

---

## ✨ Características

### 🔐 Autenticación y Seguridad
- Sistema de login y registro con JWT
- Encriptación de contraseñas con bcrypt
- Sesiones persistentes con localStorage

### 📦 Gestión de Inventario
- CRUD completo de productos
- Búsqueda en tiempo real
- Control de stock automático
- Alertas de bajo inventario

### 🛒 Punto de Venta
- Carrito de compras intuitivo
- Múltiples métodos de pago (Efectivo, Tarjeta, Transferencia)
- Cálculo automático de totales
- Actualización de stock en tiempo real

### 🧾 Sistema de Comprobantes
- Generación automática de tickets
- Impresión directa desde el navegador
- Formato profesional optimizado para tickets de 80mm

### 📊 Dashboard Analítico
- Estadísticas de ventas (diarias, mensuales, totales)
- Gráficos interactivos con Recharts
- Productos más vendidos
- Análisis por método de pago

### 📋 Gestión de Ventas
- Historial completo de transacciones
- Exportación a CSV para análisis externo
- Filtrado y búsqueda de ventas

### 📱 Diseño Responsive
- Optimizado para desktop, tablet y móvil
- Interfaz moderna y profesional

---

## 🚀 Stack Tecnológico

### Frontend
- **React 18** - Librería de interfaz de usuario
- **Vite** - Build tool y dev server
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **CSS3** - Estilos modernos con animaciones

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **SQLite** - Base de datos embebida
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación

**1. Clonar el repositorio**
```bash
git clone [https://github.com/ipiseradev/pos-system.git](https://github.com/ipiseradev/pos-system.git)
cd pos-system

2. Configurar el Backend

cd backend
# Instalar dependencias
npm install
# Iniciar servidor
npm start

3. Configurar el Frontend

cd frontend
# Instalar dependencias
npm install
# Iniciar aplicación
npm run dev

4. Acceder a la aplicación

Frontend: http://localhost:5173
Backend API: http://localhost:3000

📂 Estructura del Proyecto

pos-system/
├── backend/
│   ├── database/
│   │   ├── db.js              # Configuración SQLite
│   │   └── pos.db             # Base de datos
│   ├── routes/
│   │   ├── auth.js            # Autenticación
│   │   ├── productos.js       # CRUD productos
│   │   ├── ventas.js          # Gestión ventas
│   │   └── estadisticas.js    # Estadísticas
│   ├── server.js              # Servidor Express
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js         # Cliente Axios
    │   ├── App.jsx            # Componente principal
    │   ├── App.css            # Estilos
    │   └── main.jsx           # Entry point
    ├── package.json
    └── vite.config.js

💡 Uso

Primer Inicio

Accede a http://localhost:5173
Registra un nuevo usuario
Inicia sesión con tus credenciales

Gestión de Productos
Agregar: Clic en "+ Nuevo"
Editar: Clic en ✏️
Eliminar: Clic en 🗑️
Buscar: Usa el buscador en tiempo real

Realizar Ventas
Agrega productos al carrito
Ajusta cantidades con +/-
Selecciona método de pago
Clic en "✅ Vender"
Imprime o cierra el ticket
Exportar Datos
Ve a "Historial"
Clic en "📥 Exportar CSV"
Abre en Excel o Google Sheets
🔒 Seguridad
✅ Contraseñas hasheadas con bcrypt
✅ Tokens JWT con expiración de 24h
✅ Validación de datos en backend
✅ Protección contra SQL injection

🛠️ Scripts Disponibles

Backend
npm start # Inciar el Servidor 

Frontend
npm run dev        # Modo desarrollo
npm run build      # Build producción
npm run preview    # Preview build

📈 Roadmap
 Roles de usuario
 Reportes PDF
 Integración impresoras térmicas
 Sistema de descuentos
 Gestión de clientes
 Multi-sucursal

 🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea tu rama (git checkout -b feature/NuevaCaracteristica)
Commit tus cambios (git commit -m 'Agregar característica')
Push a la rama (git push origin feature/NuevaCaracteristica)
Abre un Pull Request

📄 Licencia
Este proyecto está bajo la Licencia MIT.


👨‍💻 Autor
Ignacio Pisera


⭐ Si este proyecto te fue útil, dale una estrella!
Hecho con ❤️ por Ignacio Pisera