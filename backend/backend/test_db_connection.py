# test_db_connection.py
import os
import psycopg2
from decouple import config

# Carga las variables de entorno desde .env
# Asegúrate de que la ruta a .env sea correcta si no está en la raíz del proyecto
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent # Esto asume test_db_connection.py está en backend/
dotenv_path = os.path.join(BASE_DIR, '.env')

if os.path.exists(dotenv_path):
    from dotenv import load_dotenv # Usamos python-dotenv aquí solo para esta prueba rápida
    load_dotenv(dotenv_path)
    print(f"INFO: .env file found and loaded from: {dotenv_path}")
else:
    print(f"ERROR: .env file NOT found at: {dotenv_path}")

# Obtén las credenciales
DB_HOST = config('DB_HOST')
DB_NAME = config('DB_NAME')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_PORT = config('DB_PORT', default='25060') # Asegúrate que sea un string aquí, psycopg2 lo convertirá

print("\n--- Intentando Conectar a la Base de Datos ---")
print(f"Host: {DB_HOST}")
print(f"Port: {DB_PORT}")
print(f"User: {DB_USER}")
print(f"DB Name: {DB_NAME}")
# print(f"Password: {DB_PASSWORD}") # No imprimir la contraseña en un entorno real
print("---------------------------------------------")

conn = None
try:
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        # Para DigitalOcean, SSL es casi siempre necesario.
        # 'require' o 'verify-full' son comunes.
        sslmode='require'
    )
    cur = conn.cursor()
    cur.execute("SELECT version();")
    db_version = cur.fetchone()
    print(f"\n¡Conexión Exitosa! Versión de PostgreSQL: {db_version[0]}")
    cur.execute("SELECT COUNT(*) FROM veluxapp_categoria_productos;") # Intenta una consulta simple
    count = cur.fetchone()[0]
    print(f"Número de categorías existentes: {count}")

except psycopg2.OperationalError as e:
    print(f"\n¡Error de Conexión Operacional! Detalles: {e}")
    print("Esto indica un problema con la red, firewall, credenciales o configuración SSL.")
except Exception as e:
    print(f"\n¡Ocurrió un Error Inesperado! Detalles: {e}")
finally:
    if conn:
        conn.close()
        print("\nConexión cerrada.")