import { useState, useEffect } from 'react'
import api from './services/api'
import './App.css'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [authView, setAuthView] = useState('login')
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const [vista, setVista] = useState('pos')
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [ventas, setVentas] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [ticketVenta, setTicketVenta] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', precio: '', stock: '', categoria: 'General'
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
      cargarProductos()
    } else {
      setLoading(false)
    }
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      const endpoint = authView === 'login' ? '/auth/login' : '/auth/registro'
      const response = await api.post(endpoint, authForm)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
      setUsuario(response.data.usuario)
      cargarProductos()
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Error de conexión')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    setProductos([])
    setCarrito([])
  }

  const cargarProductos = async () => {
    try {
      const response = await api.get('/productos')
      setProductos(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const cargarVentas = async () => {
    const response = await api.get('/ventas')
    setVentas(response.data)
  }

  const cargarEstadisticas = async () => {
    const response = await api.get('/estadisticas')
    setEstadisticas(response.data)
  }

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista)
    if (nuevaVista === 'historial') cargarVentas()
    if (nuevaVista === 'dashboard') cargarEstadisticas()
  }

  const agregarAlCarrito = (producto) => {
    if (productoEditando) return
    const existente = carrito.find(item => item.id === producto.id)
    if (existente) {
      if (existente.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        ))
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
  }

  const quitarDelCarrito = (id) => setCarrito(carrito.filter(item => item.id !== id))
  
  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) return
    const prod = productos.find(p => p.id === id)
    if (cantidad > prod.stock) return
    setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad } : item))
  }
  
  const calcularTotal = () => carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)

  const realizarVenta = async () => {
    if (carrito.length === 0) { 
      setMensaje('⚠️ Carrito vacío')
      setTimeout(() => setMensaje(''), 3000)
      return 
    }
    try {
      const response = await api.post('/ventas', {
        items: carrito.map(item => ({ 
          productoId: item.id, 
          nombre: item.nombre, 
          precio: item.precio, 
          cantidad: item.cantidad 
        })),
        metodoPago
      })
      
      setTicketVenta({
        id: response.data.id,
        fecha: new Date().toLocaleString('es-AR'),
        items: [...carrito],
        metodoPago,
        total: calcularTotal()
      })
      
      setCarrito([])
      cargarProductos()
    } catch (error) { 
      setMensaje('❌ Error') 
    }
  }

  const agregarProducto = async (e) => {
    e.preventDefault()
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) { 
      setMensaje('⚠️ Completá todos los campos')
      return 
    }
    try {
      await api.post('/productos', { 
        nombre: nuevoProducto.nombre, 
        precio: parseFloat(nuevoProducto.precio), 
        stock: parseInt(nuevoProducto.stock), 
        categoria: nuevoProducto.categoria 
      })
      setMensaje('✅ Producto agregado')
      setNuevoProducto({ nombre: '', precio: '', stock: '', categoria: 'General' })
      setMostrarFormulario(false)
      cargarProductos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) { 
      setMensaje('❌ Error') 
    }
  }

  const iniciarEdicion = (producto, e) => { 
    e.stopPropagation()
    setProductoEditando({ ...producto }) 
  }
  
  const guardarEdicion = async () => {
    try {
      await api.put(`/productos/${productoEditando.id}`, productoEditando)
      setMensaje('✅ Producto actualizado')
      setProductoEditando(null)
      cargarProductos()
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) { 
      setMensaje('❌ Error') 
    }
  }
  
  const cancelarEdicion = () => setProductoEditando(null)
  
  const eliminarProducto = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('¿Eliminar producto?')) return
    await api.delete(`/productos/${id}`)
    setMensaje('✅ Eliminado')
    cargarProductos()
    setCarrito(carrito.filter(item => item.id !== id))
    setTimeout(() => setMensaje(''), 3000)
  }

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString('es-AR')

  const exportarCSV = () => {
    const headers = ['ID', 'Fecha', 'Método Pago', 'Total']
    const rows = ventas.map(v => [
      v.id,
      formatearFecha(v.fecha),
      v.metodo_pago,
      v.total
    ])
    
    const csv = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ventas_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading && usuario) return <div className="loading">Cargando...</div>

  if (!usuario) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>🛒 Sistema POS</h1>
          <p className="auth-subtitle">Gestión de Inventario y Ventas</p>
          <div className="auth-tabs">
            <button className={authView === 'login' ? 'active' : ''} onClick={() => setAuthView('login')}>Iniciar Sesión</button>
            <button className={authView === 'registro' ? 'active' : ''} onClick={() => setAuthView('registro')}>Registrarse</button>
          </div>
          <form onSubmit={handleAuthSubmit}>
            {authView === 'registro' && <input type="text" placeholder="Nombre" value={authForm.nombre} onChange={(e) => setAuthForm({...authForm, nombre: e.target.value})} />}
            <input type="email" placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
            <input type="password" placeholder="Contraseña" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
            {authError && <p className="auth-error">{authError}</p>}
            <button type="submit" className="btn-auth">{authView === 'login' ? '🔐 Ingresar' : '📝 Registrarse'}</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1>🛒 Sistema POS</h1>
          <p>Bienvenido, <strong>{usuario.nombre}</strong></p>
        </div>
        <div className="header-right">
          <button className={`btn-nav ${vista === 'pos' ? 'active' : ''}`} onClick={() => cambiarVista('pos')}>🛒 POS</button>
          <button className={`btn-nav ${vista === 'dashboard' ? 'active' : ''}`} onClick={() => cambiarVista('dashboard')}>📊 Dashboard</button>
          <button className={`btn-nav ${vista === 'historial' ? 'active' : ''}`} onClick={() => cambiarVista('historial')}>📋 Historial</button>
          <button className="btn-logout" onClick={logout}>🚪</button>
        </div>
      </header>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      {productoEditando && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>✏️ Editar Producto</h3>
            <input type="text" value={productoEditando.nombre} onChange={(e) => setProductoEditando({...productoEditando, nombre: e.target.value})} />
            <div className="form-row-doble">
              <input type="number" value={productoEditando.precio} onChange={(e) => setProductoEditando({...productoEditando, precio: e.target.value})} />
              <input type="number" value={productoEditando.stock} onChange={(e) => setProductoEditando({...productoEditando, stock: e.target.value})} />
            </div>
            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button>
              <button className="btn-guardar" onClick={guardarEdicion}>💾 Guardar</button>
            </div>
          </div>
        </div>
      )}

      {ticketVenta && (
        <div className="modal-overlay">
          <div className="ticket">
            <div className="ticket-header">
              <h2>🧾 Comprobante</h2>
              <span className="ticket-numero">#{ticketVenta.id}</span>
            </div>
            <p className="ticket-fecha">{ticketVenta.fecha}</p>
            <div className="ticket-linea"></div>
            <div className="ticket-items">
              {ticketVenta.items.map((item, i) => (
                <div key={i} className="ticket-item">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="ticket-linea"></div>
            <div className="ticket-total">
              <span>TOTAL</span>
              <span>${ticketVenta.total.toLocaleString()}</span>
            </div>
            <p className="ticket-metodo">Pagó con: {ticketVenta.metodoPago}</p>
            <p className="ticket-gracias">¡Gracias por su compra!</p>
            <div className="ticket-buttons">
              <button className="btn-imprimir-ticket" onClick={() => window.print()}>🖨️ Imprimir</button>
              <button className="btn-cerrar-ticket" onClick={() => setTicketVenta(null)}>✓ Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {vista === 'dashboard' && estadisticas && (
        <div className="dashboard">
          <div className="stats-grid">
            <div className="stat-card"><span className="stat-icon">💰</span><div className="stat-info"><h3>Ventas Hoy</h3><p className="stat-value">${estadisticas.ventasHoy.total.toLocaleString()}</p><span className="stat-sub">{estadisticas.ventasHoy.cantidad} ventas</span></div></div>
            <div className="stat-card"><span className="stat-icon">📅</span><div className="stat-info"><h3>Ventas del Mes</h3><p className="stat-value">${estadisticas.ventasMes.total.toLocaleString()}</p><span className="stat-sub">{estadisticas.ventasMes.cantidad} ventas</span></div></div>
            <div className="stat-card"><span className="stat-icon">📦</span><div className="stat-info"><h3>Productos</h3><p className="stat-value">{estadisticas.totalProductos}</p><span className="stat-sub">{estadisticas.productosBajoStock} bajo stock</span></div></div>
            <div className="stat-card"><span className="stat-icon">🏆</span><div className="stat-info"><h3>Total Histórico</h3><p className="stat-value">${estadisticas.ventasTotal.total.toLocaleString()}</p><span className="stat-sub">{estadisticas.ventasTotal.cantidad} ventas</span></div></div>
          </div>

          <div className="charts-grid">
            <div className="dashboard-card">
              <h3>🏅 Productos Más Vendidos</h3>
              {estadisticas.productosTop.length === 0 ? <p className="no-data">Sin datos</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estadisticas.productosTop}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="nombre" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                    <Bar dataKey="vendidos" fill="#00d9ff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="dashboard-card">
              <h3>💳 Ventas por Método de Pago</h3>
              {estadisticas.ventasPorMetodo.length === 0 ? <p className="no-data">Sin datos</p> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={estadisticas.ventasPorMetodo} dataKey="total" nameKey="metodo_pago" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.metodo_pago}: $${entry.total.toLocaleString()}`}>
                      {estadisticas.ventasPorMetodo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#00d9ff', '#00ff88', '#ff6b9d'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card"><h3>📋 Top 5 Productos</h3>{estadisticas.productosTop.length === 0 ? <p className="no-data">Sin datos</p> : <div className="top-list">{estadisticas.productosTop.map((p, i) => (<div key={i} className="top-item"><span className="top-rank">#{i + 1}</span><span className="top-name">{p.nombre}</span><span className="top-stats">{p.vendidos} uds</span></div>))}</div>}</div>
            <div className="dashboard-card"><h3>💵 Resumen por Método</h3>{estadisticas.ventasPorMetodo.length === 0 ? <p className="no-data">Sin datos</p> : <div className="metodos-list">{estadisticas.ventasPorMetodo.map((m, i) => (<div key={i} className="metodo-item"><span>{m.metodo_pago === 'efectivo' ? '💵' : m.metodo_pago === 'tarjeta' ? '💳' : '📱'} {m.metodo_pago}</span><span>{m.cantidad} ventas</span><span className="metodo-total">${m.total.toLocaleString()}</span></div>))}</div>}</div>
          </div>
        </div>
      )}

      {vista === 'historial' && (
        <section className="historial-panel">
          <div className="historial-header">
            <h2>📋 Historial de Ventas</h2>
            <button className="btn-exportar" onClick={exportarCSV}>📥 Exportar CSV</button>
          </div>
          <div className="ventas-lista">
            {ventas.map(venta => (
              <div key={venta.id} className="venta-card">
                <div className="venta-header"><span>Venta #{venta.id}</span><span>{formatearFecha(venta.fecha)}</span></div>
                <div className="venta-footer"><span className="metodo-pago-badge">{venta.metodo_pago}</span><span className="venta-total">${venta.total.toLocaleString()}</span></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {vista === 'pos' && (
        <div className="pos-container">
          <section className="productos-panel">
            <div className="panel-header">
              <h2>📦 Productos</h2>
              <button className="btn-agregar-producto" onClick={() => setMostrarFormulario(!mostrarFormulario)}>{mostrarFormulario ? '✕' : '+ Nuevo'}</button>
            </div>

            <div className="buscador-container">
              <input type="text" className="buscador-input" placeholder="🔍 Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {busqueda && <button className="btn-limpiar-busqueda" onClick={() => setBusqueda('')}>✕</button>}
            </div>

            {mostrarFormulario && (
              <form className="formulario-producto" onSubmit={agregarProducto}>
                <input type="text" placeholder="Nombre" value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
                <div className="form-row-doble">
                  <input type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
                  <input type="number" placeholder="Stock" value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})} />
                </div>
                <button type="submit" className="btn-guardar">💾 Guardar</button>
              </form>
            )}

            <div className="productos-grid">
              {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
                <div key={p.id} className={`producto-card ${p.stock === 0 ? 'sin-stock' : ''}`} onClick={() => p.stock > 0 && agregarAlCarrito(p)}>
                  <div className="producto-actions">
                    <button className="btn-editar" onClick={(e) => iniciarEdicion(p, e)}>✏️</button>
                    <button className="btn-eliminar" onClick={(e) => eliminarProducto(p.id, e)}>🗑️</button>
                  </div>
                  <h3>{p.nombre}</h3>
                  <p className="precio">${p.precio.toLocaleString()}</p>
                  <p className="stock">Stock: {p.stock}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="carrito-panel">
            <h2>🧾 Carrito</h2>
            {carrito.length === 0 ? <p className="carrito-vacio">Agregá productos</p> : (
              <>
                <div className="carrito-items">
                  {carrito.map(item => (
                    <div key={item.id} className="carrito-item">
                      <span>{item.nombre}</span>
                      <div className="item-controles">
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                        <button className="btn-quitar" onClick={() => quitarDelCarrito(item.id)}>🗑️</button>
                      </div>
                      <span>${(item.precio * item.cantidad).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="carrito-footer">
                  <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta</option>
                    <option value="transferencia">📱 Transferencia</option>
                  </select>
                  <div className="total"><span>TOTAL:</span><span className="total-monto">${calcularTotal().toLocaleString()}</span></div>
                  <button className="btn-vender" onClick={realizarVenta}>✅ Vender</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App