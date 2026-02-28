# Finca App Chirpstack

Use the chirpstack repository https://github.com/chirpstack/chirpstack-docker.git

Before starting Docker Compose, make sure to create the `.env` file using the configuration provided in `.example.env`.

## 1. Chirpstack Data Path Setup

The server must have the following path:

`${BASE_PATH}/${ENVIRONMENT}-srv/docker-data/chirpstack`

`${BASE_PATH}/${ENVIRONMENT}-srv/docker-data/chirpstack-db`

`${BASE_PATH}/${ENVIRONMENT}-srv/docker-data/chirpstack-redis`

The `${BASE_PATH}` and `${ENVIRONMENT}` variables are defined in the `.env` file.

**Example:**

`/srv/production-srv/docker-data/{chirpstack,chirpstack-db,chirpstack-redis}`

### Create the path

Replace `$ENV_USER` with the username for that environment.

> **Note:** $ENV_USER is **NOT** defined in the `.env` file.

Replace `${BASE_PATH}` and `${ENVIRONMENT}` with the value from the `.env` file.

```bash
sudo mkdir -p ${BASE_PATH}/${ENVIRONMENT}-srv/docker-data/{chirpstack,chirpstack-db,chirpstack-redis}
sudo chown -R $ENV_USER:$ENV_USER ${BASE_PATH}/${ENVIRONMENT}-srv/docker-data/{chirpstack,chirpstack-db,chirpstack-redis}
```

**Example:**

```bash
sudo mkdir -p /srv/production-srv/docker-data/{chirpstack,chirpstack-db,chirpstack-redis}
sudo chown -R 100000:100000 /srv/production-srv/docker-data/{chirpstack,chirpstack-db,chirpstack-redis}
```

The user is not the owner of this folders, to protect data.

## 2. Create Containers

```bash
docker compose up -d
```

## 3. Change default user

Create new admin user and delete the default one
