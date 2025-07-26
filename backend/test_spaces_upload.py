import boto3
import os
import sys

print("--- Iniciando test_spaces_upload.py ---")

# Lee las credenciales de las variables de entorno, igual que Django
DO_SPACES_KEY = os.environ.get('DO_SPACES_KEY')
DO_SPACES_SECRET = os.environ.get('DO_SPACES_SECRET')
DO_SPACES_NAME = os.environ.get('DO_SPACES_NAME')
DO_SPACES_REGION = os.environ.get('DO_SPACES_REGION')

if not all([DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_NAME, DO_SPACES_REGION]):
    print("ERROR: Asegúrate de que DO_SPACES_KEY, DO_SPACES_SECRET, DO_SPACES_NAME y DO_SPACES_REGION estén configuradas como variables de entorno en DigitalOcean App Platform.")
    sys.exit(1) # Salir con error

AWS_S3_ENDPOINT_URL = f'https://{DO_SPACES_REGION}.digitaloceanspaces.com'

session = boto3.session.Session()
try:
    client = session.client(
        's3',
        region_name=DO_SPACES_REGION,
        endpoint_url=AWS_S3_ENDPOINT_URL,
        aws_access_key_id=DO_SPACES_KEY,
        aws_secret_access_key=DO_SPACES_SECRET
    )
    print("Boto3 client inicializado correctamente.")
except Exception as e:
    print(f"ERROR: Falló la inicialización de Boto3 client: {e}")
    sys.exit(1)

file_content = b"Este es un archivo de prueba desde un script de Python en App Platform. " + \
               b"Fecha y hora: " + str(os.getenv('BUILD_TIME', 'N/A')).encode('utf-8') + \
               b" - " + str(os.getenv('COMMIT_SHA', 'N/A')).encode('utf-8')
file_name = "test-upload-from-script.txt"
object_key = f"media/test_uploads/{file_name}" # Ruta dentro de tu bucket

try:
    print(f"Intentando subir '{object_key}' al bucket '{DO_SPACES_NAME}' en '{AWS_S3_ENDPOINT_URL}'...")
    client.put_object(
        Bucket=DO_SPACES_NAME,
        Key=object_key,
        Body=file_content,
        ACL='public-read' # Para que sea legible públicamente
    )
    print(f"¡ÉXITO! Archivo '{object_key}' subido correctamente al Space.")
    # Puedes verificar el archivo directamente en tu panel de DO Spaces
except client.exceptions.ClientError as e:
    print(f"ERROR: Falló la subida de boto3 (ClientError): {e}")
    print(f"  Código de error: {e.response.get('Error', {}).get('Code')}")
    print(f"  Mensaje de error: {e.response.get('Error', {}).get('Message')}")
except Exception as e:
    print(f"ERROR: Ocurrió un error inesperado durante la subida: {e}")

print("--- Fin de test_spaces_upload.py ---")