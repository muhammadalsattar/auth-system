# Auth System
We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a relational database, and serving HTTP traffic from a public endpoint.

### Storage
We are using a relational database (Postgres) for data saving/retrieving.

### Schema

#### users
| Column      |    Type     |
| ----------- | ----------- |
| ID          |   String    |
| first_name  |   String    |
| last_name   |   String    |
| email       |   String    |
| password    |   String    |
| confirmed   |   Boolean   |

#### secrets
| Column      |    Type     |
| ----------- | ----------- |
| id          |   SERIAL    |
| user_id     | FOREIGN KEY |
| base32      |   String    |
| otpauth_url |   String    |
| verified    |   String    |

#### session
| Column      |    Type     |
| ----------- | ----------- |
| sid         |  VARCHAR    |
| sess        |  JSON       |
| expire      |  Timestamp  |


### Server
A simple HTTP server is responsible for authentication, serving stored data, and potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- pg to be used as an ORM.

#### Auth
We are using Speakeasy to setup two factor authentication system.

#### API
```
/signin [POST]
/signup [POST]
/confirm/:token [GET]
/verifyqr [POST]
/resetqr [POST]
/sendconfirmation [POST]
/logout [POST]
/twofactorauth [POST]
```

### Middlewares
We are using one middleware for now, _isAuthenticated_  to control server requests

### Session
We are using `express-session` to setup a user session system for the server.

### Client
For now we'll start with a single web client with ReactJS, possibly adding mobile clients later.
