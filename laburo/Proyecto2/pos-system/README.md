🛒 Sistema POS - Punto de Venta Profesional
Sistema completo de gestión comercial con inventario, ventas y análisis estadístico en tiempo real.

✨ Características Principales
🔐 Autenticación y Seguridad
Sistema de login y registro con JWT
Encriptación de contraseñas con bcrypt
Sesiones persistentes con localStorage
📦 Gestión de Inventario
CRUD completo de productos
Búsqueda en tiempo real
Control de stock automático
Alertas de bajo inventario
🛒 Punto de Venta
Carrito de compras intuitivo
Múltiples métodos de pago (Efectivo, Tarjeta, Transferencia)
Cálculo automático de totales
Actualización de stock en tiempo real
🧾 Sistema de Comprobantes
Generación automática de tickets
Impresión directa desde el navegador
Formato profesional optimizado para tickets de 80mm
📊 Dashboard Analítico
Estadísticas de ventas (diarias, mensuales, totales)
Gráficos interactivos con Recharts
Productos más vendidos
Análisis por método de pago
Alertas de productos con bajo stock
📋 Gestión de Ventas
Historial completo de transacciones
Exportación a CSV para análisis externo
Filtrado y búsqueda de ventas
📱 Diseño Responsive
Optimizado para desktop, tablet y móvil
Interfaz moderna y profesional
Experiencia de usuario fluida
🚀 Stack Tecnológico
Frontend
React 18 - Librería de interfaz de usuario
Vite - Build tool y dev server
Recharts - Gráficos y visualizaciones
Axios - Cliente HTTP
CSS3 - Estilos modernos con animaciones
Backend
Node.js - Runtime de JavaScript
Express - Framework web
SQLite (better-sqlite3) - Base de datos embebida
JWT (jsonwebtoken) - Autenticación
bcryptjs - Encriptación de contraseñas
CORS - Manejo de peticiones cross-origin
📦 Instalación y Configuración
Prerrequisitos
Node.js 16+ instalado
npm o yarn
1. Clonar el repositorio
bash
git clone https://github.com/ipiseradev/pos-system.git
cd pos-system
2. Configurar Backend
bash
cd backend
npm install
node server.js
El servidor estará disponible en: http://localhost:3000

3. Configurar Frontend
bash
cd frontend
npm install
npm run dev
La aplicación estará disponible en: http://localhost:5173

🎯 Uso del Sistema
Primer Inicio
Accede a http://localhost:5173
Registra un nuevo usuario
Inicia sesión con tus credenciales
Gestión de Productos
Agregar: Clic en "+ Nuevo" en el panel de productos
Editar: Clic en el ícono ✏️ de cada producto
Eliminar: Clic en el ícono 🗑️ (requiere confirmación)
Buscar: Usa el buscador en tiempo real
Realizar Ventas
Agrega productos al carrito haciendo clic en ellos
Ajusta cantidades con los botones +/-
Selecciona el método de pago
Clic en "✅ Vender"
Imprime o cierra el comprobante
Dashboard
Visualiza estadísticas en tiempo real
Analiza productos más vendidos
Revisa ventas por método de pago
Exportar Datos
Ve a "Historial"
Clic en "📥 Exportar CSV"
Abre el archivo en Excel o Google Sheets
📂 Estructura del Proyecto
pos-system/
├── backend/
│   ├── database/
│   │   ├── db.js          # Configuración SQLite
│   │   └── pos.db         # Base de datos (generada automáticamente)
│   ├── routes/
│   │   ├── auth.js        # Rutas de autenticación
│   │   ├── productos.js   # CRUD de productos
│   │   ├── ventas.js      # Gestión de ventas
│   │   └── estadisticas.js # Endpoints de estadísticas
│   ├── server.js          # Servidor principal
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.js     # Configuración Axios
    │   ├── App.jsx        # Componente principal
    │   ├── App.css        # Estilos globales
    │   └── main.jsx       # Entry point
    ├── package.json
    └── vite.config.js
🔒 Seguridad
✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
✅ Tokens JWT con expiración de 24 horas
✅ Validación de datos en backend
✅ Protección contra inyección SQL (prepared statements)
Nota de Producción: Para despliegue en producción, se recomienda:

Mover JWT_SECRET a variables de entorno
Implementar HTTPS
Configurar rate limiting
Agregar middleware de autenticación en rutas protegidas
🎨 Capturas de Pantalla
(Agrega aquí capturas de pantalla del sistema)

🛠️ Desarrollo
Scripts Disponibles
Backend:

bash
node server.js          # Iniciar servidor
Frontend:

bash
npm run dev            # Modo desarrollo
npm run build          # Build de producción
npm run preview        # Preview del build
📈 Roadmap Futuro
 Roles de usuario (Admin, Vendedor, Supervisor)
 Reportes PDF personalizados
 Integración con impresoras térmicas
 Sistema de descuentos y promociones
 Gestión de clientes
 Multi-sucursal
 API REST documentada con Swagger
 Backup automático de base de datos
🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor:

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/NuevaCaracteristica)
Commit tus cambios (git commit -m 'Agregar nueva característica')
Push a la rama (git push origin feature/NuevaCaracteristica)
Abre un Pull Request
📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.

👨‍💻 Autor
Ignacio Pisera

GitHub: @ipiseradev
LinkedIn: Ignacio Pisera
💡 Soporte
Si encuentras algún bug o tienes sugerencias:

Abre un Issue
Contacta al desarrollador
**⭐ Si este proyecto te fue útil, no olvides darle una