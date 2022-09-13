# Engage REST API

![Tests](https://github.com/mmanishh/engage-api/workflows/Node.js%20CI/badge.svg?branch=master)


## Clone Repo

clone this repo with `https` / `ssh` / `github cli`

```sh
git clone https://github.com/mmanishh/engage-api.git
```

After cloning this repo, make sure you have `duplicated` the `.env.local` file to `.env`, don't let the .env.example file be deleted or renamed.

```sh
cp .env.local .env
```

Update your DB configs in  ``.env`` file

## Install Dependencies

```sh
npm install
```

## Bootstrap DB

To create database, migrate tables and seed data run: 
```sh
npm run db:setup
```

## Start Server

```sh
npm run start
```

## Tests

``sequelize-mock`` is used to mock the sequelize database rather than hitting the actual database. To run tests

```sh
npm run test
```
## Test Coverage 

```sh
npm run test:cov
```

## Docker Setup

If you spin up the db and app through docker you can use docker-compose.

```sh
docker-compose up -d --build
```

To bootstrap db,tables and data in docker container run 

```sh
docker-compose exec engage_api sh
```

and inside the container shell run

```sh
npm run db:setup
```

## API Docs

You can find Swagger REST API Docs:

```
http://localhost:7000/api/v1/docs
```

Postman Docs

```
https://documenter.getpostman.com/view/77908/2s7YYoAReF
```

## Features Achieved

- Basic JWT Authentication
- Register and Login user
- CRU API for Employees, Companies and User
- Use of DB transactions when creating employee along with company payload
- Integration tests for all APIS with test coverage upto 96.92 using sequelize-mock. I would like to mock each unit service and controller using jest mock if i had more time.
- Two type of test implemented
    - Hitting actual DB which is ``user.e2e.js`` . This will create test db and call apis and run tests
    - Mocking DB using sequelize-mock 
- Basic payload validaiton for all methods for all entities
- Dockerization of app
