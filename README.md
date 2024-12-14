## TODO: more tests

# System

### Contains a webapp and an api which has a cron scheduler that will resorder stock every midnight, scheduler could potentially be a separate service.

### Once a purchase order is created and checks pass, it will be with status pending at first, once the order has arrived there should be a request to the API to update its status to COMPLETED

### Every midnight the scheduler checks if quantity in stock is equal to or below threshold which then triggers reorder.

## Project setup

```bash
$ cd api
$ npm install

# Ensure there's .env file with the correct database setup or rename .env.example
# Setup a postgres database and change USER, PASSWORD and MYDATABASE accordingly
# ie. Create a database called vinum and rename MYDATABASE to vinum
$ postgresql://USER:PASSWORD@localhost:5432/MYDATABASE?schema=public

# Prisma setup
# Generate prisma types and migrate database
$ npm run prisma:setup

# Seed database
$ npm run seed

# Webapp
$ cd api
$ npm install
```

## Run services

```bash
# API runs on port 4000 by default
$ cd api
$ npm run start

# Webapp
$ cd webapp
$ npm run dev

```
