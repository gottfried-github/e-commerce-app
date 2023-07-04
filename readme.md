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

Run this command, wait 1 minute to make sure the script has connected to the database and executed [`1`], and then you can interrupt (`CTRL+c`):

`docker compose -f init-db.docker-compose.yml up --build`

### Apply migrations and create admin user for the app
First, temporarily remove the `"type": "module"` declaration from `e-commerce-common/package.json` and `e-commerce-mongo/package.json` [`2`].

Then, run:

`docker compose -f init-app.docker-compose.yml up --build`

Then, add the `"type": "module"` declaration back in.

### Run the application
From within `e-commerce-common`:

`docker compose -f run.docker-compose.yml up --build`

### Access the network
run `docker ps`, find container with IMAGE of "fi-common_node" and copy it's ID (e.g., e28354082f09)

then `docker inspect` that container and find *NetworkSettings.Networks.fi-common_default.IPAddress*

this is taken from [here](https://stackoverflow.com/a/56741737)

### Notes
1. The `init-db.sh` script gets run after 1 minute of sleep, to make sure the `init` container has established the database for connections. This is probably not the most elegant way of doing things but for now I haven't come up with a better way (the better way would be to somehow condition the `init` container and the `init-db.sh` script on the log output of the `base` container).
2. `migrate-mongo`, which is run in `init-app.sh`, doesn't work with es6 modules.