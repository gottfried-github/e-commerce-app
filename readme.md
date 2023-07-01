# Description
A modular e-commerce application. Consists of [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react) and [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo).

* [REST API specification](https://github.com/gottfried-github/e-commerce-api#rest-api)
* [store API specification](https://github.com/gottfried-github/e-commerce-api#store-api)

# Run
## Preparations
### Clone the repos
Clone [e-commerce-common](https://github.com/gottfried-github/e-commerce-common), [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo), [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react), [e-commerce-app](https://github.com/gottfried-github/e-commerce-app) and [e-commerce-signup](https://github.com/gottfried-github/e-commerce-signup) into a common root directory. Perform all further instructions inside that directory.

## Instructions
From each of the subfolders - `e-commerce-common`, `e-commerce-mongo`, `e-commerce-api`, `e-commerce-front-end`, `e-commerce-app`, `e-commerce-signup` - run `npm install`. 

Then, run the initialization commands from within `e-commerce-common`:

```shell
cd e-commerce-common

# create data directory and a keyfile for the database
./init.sh
```

### Initialize the database
Run the following command from within `e-commerce-common`.

Run this command, wait a few moments, interrupt (`CTRL+C`) and then run it again [`1`] and, possibly, a few more times:

`docker compose -f init-db.docker-compose.yml up`

### Apply migrations and create admin user for the app
First, temporarily remove the `"type": "module"` declaration from `e-commerce-common/package.json` and `e-commerce-mongo/package.json` [`2`].

Then, run:

`docker compose -f init-app.docker-compose.yml up`

Then, add the `"type": "module"` declaration back in.

### Run the application
From within `e-commerce-common`:

`docker compose -f run.docker-compose.yml up`

### Access the network
run `docker ps`, find container with IMAGE of "fi-common_node" and copy it's ID (e.g., e28354082f09)

then `docker inspect` that container and find *NetworkSettings.Networks.fi-common_default.IPAddress*

this is taken from [here](https://stackoverflow.com/a/56741737)

### Notes
1. Sometimes, the script, run by the `init` container in `init-db.docker-compose.yml` fails to connect to the database: the logs from the container indicate that. So if that happens, we need to run the whole stack multiple times.
2. `migrate-mongo`, which is run in `init-app.sh`, doesn't work with es6 modules.