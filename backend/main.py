from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routers import categorias, proveedores, productos, clientes, empleados, ventas, reportes

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Tienda API",
    description="API REST para gestión de inventario y ventas",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categorias.router,  prefix="/api/categorias",  tags=["Categorías"])
app.include_router(proveedores.router, prefix="/api/proveedores", tags=["Proveedores"])
app.include_router(productos.router,   prefix="/api/productos",   tags=["Productos"])
app.include_router(clientes.router,    prefix="/api/clientes",    tags=["Clientes"])
app.include_router(empleados.router,   prefix="/api/empleados",   tags=["Empleados"])
app.include_router(ventas.router,      prefix="/api/ventas",      tags=["Ventas"])
app.include_router(reportes.router,    prefix="/api/reportes",    tags=["Reportes"])

@app.get("/")
def root():
    return {"message": "Tienda API activa", "docs": "/docs"}