# Description
A modular e-commerce application. Consists of [fi-mongo](), [fi-api]() and [fi-front-end]().

# Api
## Specification
See the specification [here](#fi-api).

## The function of api
**Inward.** Api transmits the received data over to the store. In doing so, it should make sure that:
1. appropriate fields exist in the received data
2. the values are of the correct type
3. fields that don't belong to data, don't exist

**Outward.** Assign status codes and messages to the output of the store and send it in response to the client.

# Store api
## Validation error format
`ajv-errors-to-data-tree`-formatted tree resembling the input data, with the errors being `ValidationError`, `FieldMissing`, `TypeErrorMsg`

## create
### parameters
  1. `fields`

### behavior
* **success**: return id of created document
* **validation failure**: throw validation error

Any other error shall be treated as an internal error.

## update
### parameters
  1. `id`
  2. `write`
  3. `remove`

### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`
  * **validation failure**: throw validation error

Any other error shall be treated as an internal error.

## update photos
### parameters
1. `id`
2. `photos`

### behavior
* **success**: return `true`
* **invalid `id`**: throw `InvalidCriterion`
* **validation failure**: throw validation error
* **no document with given `id`**: return `null`

## delete
### parameters
  1. `id`

### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.

## getById
### parameters
  1. `id`

### behavior
  * **success**: return the found document
  * **no document found**: return `null`
  * **invalid id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.

# Run
## Preparations
### Clone the repos
Clone [fi-common](), [fi-mongo](), [fi-api](), [fi-front-end](), [fi-app]() into a common root directory. Perform all further instructions inside that directory.

### Keyfile path
`data/keyfile`

### Network name
`bazar-wip` or whatever you like

### Database user password
`init.sh` will create user with name *app*. It needs us to pass it a password for this user.

## Instructions
From each of the subfolders - `fi-api`, `fi-store`, `fi-common` and `fi-front-end` - run `npm install`;

All further steps have to be done from the root directory unless stated otherwise.

### Generate keyfile
keyfile for database (see details [here](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#create-a-keyfile))

```shell
openssl rand -base64 756 > <keyfile path>
chmod 400 <keyfile path>
```

### Create the network
`docker network create <network-name>`

### Mongodb instance and migrations
#### Start mongo instance with a new replica set and the user admin, if not existing
creates the admin user, with the `root` role, which, among other things, contains the `userAdminAnyDatabase` role, which allows to change data (including password) of any user in any database.
`docker run --rm -v $PWD/data:/data/db -p 27017:27017 --network <network-name> --network-alias <network-alias> -e MONGO_INITDB_ROOT_USERNAME=<admin username> -e MONGO_INITDB_ROOT_PASSWORD=<admin password> mongo --replSet rs0 --keyFile /data/db/keyfile --bind_ip <network-alias> --dbpath /data/db`

#### Initialize the replica set and the app user
creates the app user with the following roles:
`readWrite`; `dbAdmin` - to be able to perform `collMod` on collections.
`./init.sh <admin password> <app password> <network name> <network alias>`

#### Apply migrations
Run the node container, as described [below](#run-node-on-the-network); from the node container:
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=<app password> NET_NAME=<network-alias> fi-common/node_modules/.bin/migrate-mongo up -f fi-common/migrate-mongo-config.js`

But before that, temporarily remove the `type: "module"` field in `fi-common/package.json` (where `migrate-mongo` is ran from) and `fi-store/package.json` (where the migrations directory is): `migrate-mongo` doesn't work with ES modules.

### Run the app
#### Run node on the network
`docker run -it --tty -v "$(pwd)":/app -w /app --network <network-name> node bash`

#### Inside the running container, run node with these environment variables
`SESSION_SECRETS=<session secrets> APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=<app password> NET_NAME=<network-alias> node fi-app/index.js`

#### Access the network
run `docker ps`, find container with IMAGE of "node" and copy it's ID (e.g., e28354082f09)

then `docker inspect` that container and find *NetworkSettings.Networks.mongodb-distinct.IPAddress*

this is taken from [here](https://stackoverflow.com/a/56741737)
