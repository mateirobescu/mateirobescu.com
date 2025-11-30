FROM node:18-alpine as builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ .

RUN npx parcel build css/style.scss js/index.js \
    --dist-dir dist \
    --public-url /static/portfolio \
    --no-content-hash

FROM python:3.13-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt --no-cache-dir

COPY backend/ .

COPY --from=builder /app/frontend/dist/ /app/portfolio/static/portfolio/

RUN SECRET_KEY=build_dummy_key \
    ALLOWED_HOSTS=127.0.0.1 \
    DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy \
    CLOUDINARY_CLOUD_NAME=dummy \
    CLOUDINARY_API_KEY=dummy \
    CLOUDINARY_API_SECRET=dummy \
    EMAIL_HOST=dummy \
    EMAIL_PORT=587 \
    EMAIL_USE_TLS=True \
    EMAIL_HOST_USER=dummy \
    EMAIL_HOST_PASSWORD=dummy \
    DEFAULT_FROM_EMAIL=dummy \
    RECAPTCHA_SECRET_KEY=dummy \
    python manage.py collectstatic --noinput