# Auth System
Auth system is a part of a bigger project. It's an authentication system that uses two factor authentication.

## API

#### Environment Variables
you have to create `.env` file the root directory and set the following environment variables: 
- DB_HOST="database-host"
- DB_NAME="database-name"
- DB_USER="database-username"
- DB_PASSWORD="database-username"
- DB_PORT="database-port"
- PORT="server-port"
- JWTSECRET="jsonwebtoken-secret"
- GMAIL_USER="gmail-username"
- GMAIL_PASSWORD="gmail-application-password"

#### Commands
- `cd api`
- `npm i` to install packages
- `npm run migrate` to setup the database
- `npm run dev` to start the development nodemon server

#### Navigate to /docs/erd to browse api available endpoints


## Client
#### Commands
- `cd client`
- `npm i` to install packages
- `npm run start` to start the development server
- `npm run build` to create the build folder which will be used for deployment

---------------------

### Up and Running!