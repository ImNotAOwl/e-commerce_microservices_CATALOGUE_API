#!/bin/bash

# Attendre que RabbitMQ soit prêt
sleep 10

# Créer l'utilisateur catalog avec le mot de passe catalog
rabbitmqctl add_user $RABBITMQ_USER $RABBITMQ_PASSWORD

# Donner les droits à l'utilisateur catalog sur le vhost catalog-vhost
rabbitmqctl set_permissions -p / $RABBITMQ_USER ".*" ".*" ".*"

# Optionnel : Donner un rôle d'administrateur à l'utilisateur catalog
rabbitmqctl set_user_tags $RABBITMQ_USER management

echo "Configuration de RabbitMQ terminée."
