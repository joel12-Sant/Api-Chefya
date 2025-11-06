# Api para proyecto Chefya

## Estructura de carpetas

CHEFYA/
├─ app/                 # Código de la API (FastAPI)
│  ├─ main.py           # Punto de entrada de la aplicación
│  ├─ requirements.txt  # Dependencias de Python
│  ├─ Dockerfile        # Imagen para construir la API
│  └─ data/             # (opcional) Archivos locales usados por la app
├─ mongo_data/          # Datos persistentes de MongoDB (/data/db)
├─ mongodb/             # Scripts de inicialización de la base de datos
│  ├─ 00_esquema.js     # Creación de colecciones e índices
│  └─ 01_semillas.js    # Datos de prueba o iniciales
├─ .env                 # Variables de entorno (no se suben al repo)
├─ .env.example         # Ejemplo de lo que debes colocar en tu .env
├─ .dockerignore        # Archivos y carpetas excluidas del build
├─ .gitignore           # Archivos ignorados por git
├─ docker-compose.yml   # Orquestación de servicios (API + MongoDB)
└─ README.md            # Documentación del proyecto


#### Por el momento solo clona el proyecto y prueba con:

```bash
git clone https://github.com/joel12-Sant/Api-Chefya.git
cd Api-Chefya
```
Si quieres probar solo elimina el .example del .env.example (solo para pruebas, debes colocar los valores una vez los tengas)

```bash
docker-compose up --build
```

#### Dirigete a:
http://localhost:8000/

#### Si todo funciono correctamente deberias ver algo como:

```json
{"mensaje":"Conectado a MongoDB","base_datos":"chefya"}
```