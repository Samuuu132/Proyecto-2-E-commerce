-- ============================================================
-- SCHEMA: Tienda - Inventario y Ventas
-- Usuario BD: proy2 / secret
-- ============================================================

PRAGMA foreign_keys = ON;

-- Categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL,
    contacto  TEXT,
    telefono  TEXT,
    email     TEXT
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre         TEXT NOT NULL,
    descripcion    TEXT,
    precio         REAL NOT NULL CHECK(precio >= 0),
    stock          INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    categoria_id   INTEGER NOT NULL REFERENCES categorias(id),
    proveedor_id   INTEGER NOT NULL REFERENCES proveedores(id),
    creado_en      TEXT DEFAULT (datetime('now'))
);

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL,
    email     TEXT UNIQUE,
    telefono  TEXT,
    direccion TEXT
);

-- Empleados
CREATE TABLE IF NOT EXISTS empleados (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL,
    cargo     TEXT,
    email     TEXT UNIQUE,
    password  TEXT NOT NULL DEFAULT 'secret'
);

-- Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id   INTEGER NOT NULL REFERENCES clientes(id),
    empleado_id  INTEGER NOT NULL REFERENCES empleados(id),
    fecha        TEXT DEFAULT (datetime('now')),
    total        REAL NOT NULL DEFAULT 0
);

-- Detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id    INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad    INTEGER NOT NULL CHECK(cantidad > 0),
    precio_unit REAL NOT NULL CHECK(precio_unit >= 0)
);

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Electrónica',   'Dispositivos y gadgets electrónicos'),
    ('Ropa',          'Prendas de vestir y accesorios'),
    ('Alimentos',     'Productos alimenticios y bebidas'),
    ('Hogar',         'Artículos para el hogar'),
    ('Deportes',      'Equipamiento y ropa deportiva');

INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
    ('TechSupply S.A.',   'Juan Pérez',    '5555-1001', 'juan@techsupply.gt'),
    ('ModaGT',            'Ana García',    '5555-2002', 'ana@modagt.com'),
    ('FoodDistrib',       'Carlos López',  '5555-3003', 'carlos@fooddistrib.gt'),
    ('HogarPlus',         'María Martín',  '5555-4004', 'maria@hogarplus.gt'),
    ('SportZone',         'Pedro Ruiz',    '5555-5005', 'pedro@sportzone.gt');

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, proveedor_id) VALUES
    ('Auriculares Bluetooth',  'Inalámbricos, cancelación de ruido',  299.99, 50, 1, 1),
    ('Teclado Mecánico',       'RGB, switches táctiles',              449.00, 30, 1, 1),
    ('Camiseta Deportiva',     'Tela transpirable, talla M',           89.50, 100, 2, 2),
    ('Jeans Clásicos',         'Corte recto, azul oscuro',            199.00,  60, 2, 2),
    ('Café Molido 500g',       'Origen Guatemala, tostado medio',      75.00, 200, 3, 3),
    ('Agua Purificada 5L',     'Filtrada y purificada',                25.00, 500, 3, 3),
    ('Sartén Antiadherente',   '28cm, apta para inducción',           159.00,  40, 4, 4),
    ('Set de Cuchillos x5',    'Acero inoxidable con estuche',        350.00,  25, 4, 4),
    ('Balón de Fútbol',        'Cuero sintético, talla 5',            120.00,  80, 5, 5),
    ('Guantes de Box',         '12oz, cuero genuino',                 180.00,  45, 5, 5);

INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
    ('Sofía Ramírez',  'sofia@email.com',   '5501-1111', 'Zona 10, Guatemala'),
    ('Diego Morales',  'diego@email.com',   '5502-2222', 'Zona 15, Guatemala'),
    ('Valeria Torres', 'vale@email.com',    '5503-3333', 'Mixco, Guatemala'),
    ('Andrés Castro',  'andres@email.com',  '5504-4444', 'Villa Nueva, Guatemala'),
    ('Lucía Fuentes',  'lucia@email.com',   '5505-5555', 'Zona 1, Guatemala');

INSERT INTO empleados (nombre, cargo, email, password) VALUES
    ('Roberto Sánchez', 'Vendedor',  'roberto@tienda.gt', 'secret'),
    ('Mónica Vega',     'Cajera',    'monica@tienda.gt',  'secret'),
    ('Ernesto Lima',    'Supervisor','ernesto@tienda.gt', 'secret');

-- Ventas de ejemplo
INSERT INTO ventas (cliente_id, empleado_id, fecha, total) VALUES
    (1, 1, '2026-05-01 10:30:00', 389.49),
    (2, 2, '2026-05-02 14:00:00', 648.00),
    (3, 1, '2026-05-03 09:15:00', 100.00),
    (4, 3, '2026-05-10 11:00:00', 530.00),
    (5, 2, '2026-05-12 16:45:00', 294.50);

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unit) VALUES
    (1, 1, 1, 299.99),
    (1, 5, 1,  75.00),
    (1, 6, 1,  25.00),  -- venta 1 total ~400, ajustado arriba
    (2, 2, 1, 449.00),
    (2, 7, 1, 159.00),
    (3, 9, 1, 100.00),
    (4, 4, 2, 199.00),
    (4, 3, 1,  89.50),
    (5, 3, 2,  89.50),
    (5, 5, 1,  75.00);
