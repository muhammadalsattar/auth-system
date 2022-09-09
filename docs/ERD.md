# Auth System
We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a relational database, and serving HTTP traffic from a public endpoint.

### Storage
We are using a relational database (Postgres) for data saving/retrieving.

### Schema

#### users
| Column      |    Type     |
| ----------- | ----------- |
| ID          |   String    |
| First Name  |   String    |
| Last Name   |   String    |
| Email       |   String    |
| Password    |   String    |
| Confirmed   |   Boolean   |

#### secrets
| Column      |    Type     |
| ----------- | ----------- |
| id          |   SERIAL    |
| user_id     | FOREIGN KEY |
| base32      |   String    |
| otpauth_url |   String    |
| verified    |   String    |


### Server
A simple HTTP server is responsible for authentication, serving stored data, and potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Sequelize to be used as an ORM.

#### Auth
We are using two factor authentication to increase account security.

#### API
```
/signin [POST]
/signup [POST]
/confirm/:token [GET]
```

### Client
For now we'll start with a single web client, possibly adding mobile clients later.
nd. Uses Chakra UI for building the CSS components.

