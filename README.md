# CATALOGUE_API
Service - Catalogue

## RabbitMQ
Launch a standalone RabbitMQ container

```bash
docker run -d \
  --name rabbitmq \
  --hostname rabbitmq \
	--env-file .env.development.local \
  -p 5672:5672 \
  -p 15672:15672 \
  -v "$(pwd)/.docker/rabbitmq/init-rabbitmq.sh:/etc/rabbitmq/init-rabbitmq.sh" \
  rabbitmq:4.0-management \
  sh -c "rabbitmq-server & \
         bash /etc/rabbitmq/init-rabbitmq.sh && \
         tail -f /dev/null"
```

## Production
Create a folder in `.docker` named `keys`
Inside create a key named `mongo-replica-set.key` with the command :

``` bash
openssl rand -base64 756 > .docker/mongo/keys/mongo-replica-set.key
# Change permissions
sudo chmod 600 .docker/mongo/keys/mongo-replica-set.key
# Set owner : mongoDb
sudo chown 999:999 .docker/mongo/keys/mongo-replica-set.key
```

#### **Create a file `.env`**
``` bash
CATALOG_DATABASE_URL="mongodb://<toto>:<totopassword>@catalog-mongo-primary:27017,catalog-mongo-replica01:27017,catalog-mongo-replica02:27017/catalogue?replicaSet=rs0&readPreference=primary&authSource=admin"

# DOCKER ENVIRONMENT

# APPLICATION KOA
# Volume host (compose)
VOLUME_HOST_PATH=/path/to/your/production/folder
LOGS_PATH=${PWD}

# DATABASE MONGODB
# User/password for mongodb cluster Admin
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin1234

# User/password for the DB used by Catalog service
CATALOG_USER=toto
CATALOG_PASS=totopassword

# DB collection name
DB_SERVICE=catalogue

# MESSAGE BROKER - RABBITMQ
# User/password for RabbitMQ admin
RABBITMQ_DEFAULT_USER=rabbit
RABBITMQ_DEFAULT_PASS=carotte

# Connection chain with a different user to 
RABBITMQ_PROTOCOL=amqp
RABBITMQ_USER=catalog
RABBITMQ_PASSWORD=catalog
RABBITMQ_HOST=catalog-rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
```

Then run `docker-compose up -d` to launch every needed container.

## Sonarqube

Command to launch the SAST (Statique Code analysis) with a environment file
``` sh
docker run -ti -v $PWD/sonar-project.properties:/opt/sonar-scanner/conf/sonar-scanner.properties -v $PWD/:/usr/src --env-file .env --link sonarqube sonarsource/sonar-scanner-cli
```
