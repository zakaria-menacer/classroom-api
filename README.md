# Classroom Management API

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2014.0.0-brightgreen.svg)

This project is an API-only classroom management system built with [NestJS](https://nestjs.com/). It enables users to create classrooms, manage assignments with file uploads, enroll in classrooms, and submit assignments with file uploads. The system uses permission-based access control (PBAC), where each user is assigned a role, and each role has multiple permissions. Authorization is enforced by checking if the user’s role has the necessary permissions for accessing specific API endpoints.

User authentication is managed via [Okta](https://developer.okta.com/), while permissions and roles are handled within the system itself.


## Features

- **User Management**: Admins can manage user accounts.
- **Roles and permissions Management**: Users can create and manage classrooms.
- **Classroom Management**: Admins can manage roles and permissions to control access to various API endpoints.
- **Assignment Management**: Create assignments within classrooms, with the ability to upload files.
- **Enrollment**: Users can enroll in classrooms and submit assignments with file uploads.
- **Permission-Based Access Control**: API endpoints are secured based on user roles and permissions.
- **Okta Integration**: User credentials are managed via Okta, not stored in the local database.



## Getting Started
### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **PostgreSQL**: Set up PostgreSQL (or another supported SGBD, with modifications to Prisma).
- **Okta**: Create an Okta app to manage user authentication.

## Technologies

This project utilizes the following technologies and libraries:

- **[NestJS](https://nestjs.com/)**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **[Prisma](https://www.prisma.io/)**: An ORM for managing and interacting with the database.
- **[Swagger](https://swagger.io/)**: For API documentation and interactive API testing.
- **[Okta](https://www.okta.com/)**: For user authentication and identity management.
- **[TypeScript](https://www.typescriptlang.org/)**: A statically typed superset of JavaScript.
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client for making requests.
- **[Bcrypt](https://www.npmjs.com/package/bcrypt)**: For hashing passwords.
- **[Class-Validator](https://github.com/typestack/class-validator)**: For validation of class properties.
- **[Class-Transformer](https://github.com/typestack/class-transformer)**: For transforming plain objects into class instances.



## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/zakaria-menacer/classroom-api.git
cd classroom-api
```


### 2. Create Okta Application
1. Go to your Okta dashboard and create a new application of type Native.
2. Configure the settings needed.
3. Note down the Client ID, Client Secret, and organization URL.
4. Note down the api key token from security section.

### 3. Environment Setup
Create a `.env` file in the root of your project with the following variables:

```env
DATABASE_URL=postgres://username:password@host:port/database_name
PORT=3000

#OKTA
OKTA_ORG_URL= https://your-okta-organization-url
# example OKTA_ORG_URL=https://dev-123456789.okta.com

OKTA_APP_ID= your-okta-client-id
OKTA_APP_SECRET= your-okta-client-secret
OKTA_API_TOKEN= your-okta-api-token

# DEFAULT ADMIN
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

#### Important:

- Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your preferred values. Ensure these credentials do not already exist in your Okta organization to avoid errors.
* The password must be at least 8 characters long.

### 4. Installation 
After setting up the .env file, install dependencies by running:

```bash
npm install
```

This will automatically deploy the database schema, seed the database with default roles and permissions, and create a default admin user.

## Seeding the Database
If you need to reseed the database (e.g., if there were issues during the initial seeding), you can manually trigger the seeding process with:
```bash
npx prisma db seed
```

## API Documentation
API documentation is powered by Swagger and is available at:
```
GET /api/v1
```


## Contributing
Feel free to contribute by submitting a pull request or opening an issue.



## License
This project is licensed under the MIT License.

