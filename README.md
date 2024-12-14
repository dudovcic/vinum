

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
# API
$ cd api
$ npm run start

# Webapp
$ cd webapp
$ npm run dev

```