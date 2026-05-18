# Tienda — Inventario & Ventas
**cc3062 Sistemas y Tecnologías Web · UVG Ciclo 1, 2026**

Aplicación web para gestión de inventario y ventas. Frontend en React,
backend en FastAPI, base de datos SQLite, desplegada con Docker.

---

## Requisitos

- Docker >= 24
- Docker Compose v2

---

## Levantar el proyecto

```bash
# 1. Clonar el repositorio
git clone 
cd Proyecto-2-E-commerce

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar todos los servicios
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Frontend | https://proyecto-2-e-commerce-1.onrender.com |
| Backend  | https://proyecto-2-e-commerce.onrender.com |
| API Docs | https://proyecto-2-e-commerce.onrender.com/docs |

> La base de datos se inicializa automáticamente con el esquema
> y datos de prueba al primer arranque.

---

## Credenciales de BD
DB_USER=proy2
DB_PASSWORD=secret

---

## Estructura del proyecto
Proyecto-2-E-commerce/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── routers/
│       ├── categorias.py
│       ├── clientes.py
│       ├── empleados.py
│       ├── productos.py
│       ├── proveedores.py
│       ├── reportes.py
│       └── ventas.py
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── components/
│   │   └── pages/
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── Dockerfile
├── database/
│   └── schema.sql
├── docker-compose.yml
├── .env.example
└── README.md

---

## Desarrollo local sin Docker

```bash
# Backend
cd backend
pip install -r requirements.txt
DB_PATH=./tienda.db uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Lint
npm run lint

# Tests
npm run test
```

---

## API REST

Documentación interactiva en **http://localhost:8000/docs**

| Recurso | Métodos |
|---------|---------|
| `/api/categorias` | GET, POST, PUT, DELETE |
| `/api/proveedores` | GET, POST, PUT, DELETE |
| `/api/productos` | GET, POST, PUT, DELETE |
| `/api/clientes` | GET, POST, PUT, DELETE |
| `/api/empleados` | GET, POST, PUT, DELETE |
| `/api/ventas` | GET, POST, DELETE |
| `/api/reportes/resumen` | GET |
| `/api/reportes/ventas-por-mes` | GET |
| `/api/reportes/productos-mas-vendidos` | GET |
| `/api/reportes/stock-disponible` | GET |
| `/api/reportes/ventas-por-empleado` | GET |
