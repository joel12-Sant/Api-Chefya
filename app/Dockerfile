FROM python:3.12-slim

WORKDIR /app

# Copia y instala dependencias
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copia el código
COPY . .