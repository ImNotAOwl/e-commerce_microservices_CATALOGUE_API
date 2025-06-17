#!/bin/bash

echo "########### Waiting for primary ###########"
until mongosh --host catalog-mongo-primary -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --eval "printjson(db.runCommand({ serverStatus: 1}).ok)"
  do
    echo "########### Sleeping ###########"
    sleep 5
  done

echo "########### Waiting for replica 01 ###########"
until mongosh --host catalog-mongo-replica01 -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --eval "printjson(db.runCommand({ serverStatus: 1}).ok)"
  do
    echo "########### Sleeping ###########"
    sleep 5
  done

echo "########### Waiting for replica 02 ###########"
until mongosh --host catalog-mongo-replica02 -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin --eval "printjson(db.runCommand({ serverStatus: 1}).ok)"
  do
    echo "########### Sleeping ###########"
    sleep 5
  done

echo "########### All replicas are ready!!! ###########"

echo "########### Setting up cluster config ###########"
mongosh --host catalog-mongo-primary -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin <<EOF
rs.initiate(
   {
      _id: "rs0",
      version: 1,
      members: [
         { _id: 0, host : "catalog-mongo-primary:27017", priority: 2 },
         { _id: 1, host : "catalog-mongo-replica01:27017", priority: 1 },
         { _id: 2, host : "catalog-mongo-replica02:27017", priority: 1 }
      ]
   }
)
EOF

echo "########### Sleeping ###########"
sleep 10

echo "########### Setting up new user ###########"
mongosh --host catalog-mongo-primary -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin <<EOF
admin = db.getSiblingDB("admin")
admin.createUser(
  {
    user: "$CATALOG_USER",
    pwd: "$CATALOG_PASS",
    roles: [ { role: "readWrite", db: "$DB_SERVICE" } ]
  }
)
EOF

echo "########### Getting replica set status again ###########"
mongosh --host catalog-mongo-primary -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin <<EOF
rs.status()
EOF

mkdir -p /tmp/mongo-init
echo "Initialization complete" > /tmp/mongo-init/.init_done
sleep 45

echo "########### Stopping TEMP instance  ###########"
mongod --shutdown
