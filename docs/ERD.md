# Auth System
We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a relational database, and serving HTTP traffic from a public endpoint.

### Storage
We are using a relational database (Postgres) for data saving/retrieving.

### Schema

#### users
| Column      |    Type     |
| ----------- | ----------- |
| ID          |     TEXT    |
| first_name  |     TEXT    |
| last_name   |     TEXT    |
| email       |     TEXT    |
| password    |     TEXT    |
| confirmed   |   Boolean   |
| token       |     TEXT    |

#### secrets
| Column      |    Type     |
| ----------- | ----------- |
| id          |   SERIAL    |
| user_id     | FOREIGN KEY |
| base32      |     TEXT    |
| otpauth_url |     TEXT    |
| verified    |     TEXT    |



### Server
A simple HTTP server is responsible for authentication, serving stored data, and potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- pg to be used as an ORM.

#### Auth
We are using Speakeasy to setup two factor authentication system.

#### API
```
/auth [GET] middleware
/signin [POST] (email, password)
/signup [POST] (first_name, last_name, email, password, client_url)
/confirm/:token [GET]
/verifyqr [POST] (email)
/resetqr [POST] (email)
/sendconfirmation [POST] (email, client_url)
/logout [POST] middleware
/twofactorauth [POST] (email, otp)
```

### Middlewares
We are using one middleware for now, _isAuthenticated_  to control server requests

### Session
We are using `jsonwebtoken` to setup a user session system for the server.

### Client
For now we'll start with a single web client with ReactJS, possibly adding mobile clients later.
