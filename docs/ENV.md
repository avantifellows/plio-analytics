## Environment variables

This guide explains all the available configurations in your `.env` file so that you can configure your environments accordingly.

### Generic
#### `CUBEJS_DEV_MODE`
Debug mode on or off. Possible values are `True` and `False`. Do not set to true on production environments. The CubeJS Developer Playground is only available when it is set to `True`.

#### `CUBEJS_API_SECRET`
Used by CubeJS. It should be a secret value and shouldn't be added to git.
You can create a 32-digit secret key from this website: https://generate.plus/en/base64

### Database settings
#### `CUBEJS_DB_TYPE`
Database engine for Plio. It should always be `postgres` as added in `.env.example`. However, if you wish to add your own implementation, feel free to change it.

#### `CUBEJS_DB_HOST`
The database host.
1. If you're using Docker locally for your database, use `host.docker.internal`.
2. If you're using a remote database, set it accordingly.

#### `CUBEJS_DB_NAME`
The name of the database.

#### `CUBEJS_DB_PORT`
The port for the database.

#### `CUBEJS_DB_USER`
The database user.

#### `CUBEJS_DB_PASS`
The password for the database user.

### Local development server
#### `APP_API_PORT`
Port on which you want the Cube.js API to be exposed.

#### `APP_DASHBOARD_PORT`
Port on which you want the Cube.js Dashboard App to be created using the Developer Playground.
