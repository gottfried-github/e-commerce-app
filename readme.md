# Description
A modular e-commerce application. Consists of [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react) and [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo).

* [REST API specification](https://github.com/gottfried-github/e-commerce-api#rest-api)
* [store API specification](https://github.com/gottfried-github/e-commerce-api#store-api)

# Run
## Preparations
### Clone the repos
Clone [e-commerce-common](https://github.com/gottfried-github/e-commerce-common), [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo), [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react), [e-commerce-app](https://github.com/gottfried-github/e-commerce-app) and [e-commerce-signup](https://github.com/gottfried-github/e-commerce-signup) into a common root directory. Perform all further instructions inside that directory.

### Keyfile path
`data/keyfile`

### Network name
`e-commerce-wip` or whatever you like

### Database user password
`init.sh` will create user with name *app*. It needs us to pass it a password for this user.

## Instructions
From each of the subfolders - `e-commerce-common`, `e-commerce-mongo`, `e-commerce-api`, `e-commerce-front-end`, `e-commerce-app`, `e-commerce-signup` - run `npm install`. 

All further steps have to be done from the root directory unless stated otherwise.

### Generate keyfile
keyfile for database (see details [here](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#create-a-keyfile))

```shell
openssl rand -base64 756 > <keyfile path>
chmod 400 <keyfile path>
```

If you have the `data` directory already existing, then you'll want to run the above commands from within the container which created the directory because it has the permissions for it:

`docker run -it -v $PWD/data:/data/db -p 27017:27017 --network <network-name> --network-alias <network-alias> -e MONGO_INITDB_ROOT_USERNAME=<admin username> -e MONGO_INITDB_ROOT_PASSWORD=<admin password> mongo bash`

### Create the network
`docker network create <network-name>`

### Mongodb instance and migrations
#### Start mongo instance with a new replica set and the user admin, if not existing
creates the admin user, with the `root` role, which, among other things, contains the `userAdminAnyDatabase` role, which allows to change data (including password) of any user in any database.
`docker run --rm -v $PWD/data:/data/db -p 27017:27017 --network <network-name> --network-alias <network-alias> -e MONGO_INITDB_ROOT_USERNAME=<admin username> -e MONGO_INITDB_ROOT_PASSWORD=<admin password> mongo --replSet rs0 --keyFile /data/db/keyfile --bind_ip <network-alias> --dbpath /data/db`

#### Initialize the replica set and the app user
creates the app user with the following roles:
`readWrite`; `dbAdmin` - to be able to perform `collMod` on collections.
`./e-commerce-app/init.sh <admin password> <app password> <network name> <network alias>`

#### Apply migrations
Run the node container, as described [below](#run-node-on-the-network); from the node container:
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=<app password> NET_NAME=<network-alias> fi-common/node_modules/.bin/migrate-mongo up -f fi-common/migrate-mongo-config.js`

But before that, temporarily remove the `type: "module"` field in `fi-common/package.json` (where `migrate-mongo` is ran from) and `fi-store/package.json` (where the migrations directory is): `migrate-mongo` doesn't work with ES modules.

### Creating the admin user for the app
We need to create the initial admin user for the app.

#### Instructions
Run the node container, as described [below](#run-node-on-the-network); from the node container:
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=<app password> NET_NAME=<network-alias> node e-commerce-signup/src/cli.js <app admin username> <app admin email> <app admin password>`

### Run the app
#### Run node on the network
`docker run -it --tty -v "$(pwd)":/app -w /app --network <network-name> node bash`

#### Inside the running container, run node with these environment variables
`SESSION_SECRETS=<session secrets> APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=<app password> NET_NAME=<network-alias> node fi-app/index.js`

#### Access the network
run `docker ps`, find container with IMAGE of "node" and copy it's ID (e.g., e28354082f09)

then `docker inspect` that container and find *NetworkSettings.Networks.mongodb-distinct.IPAddress*

this is taken from [here](https://stackoverflow.com/a/56741737)
