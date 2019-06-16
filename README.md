# WOW - Technical Assignment

I've made the test with the fullstack JavaScript MEAN (MongoDB, Express, Angular, and Node.js). The following sections describe how to get the project up and running once it has been cloned into your machine.

# Requirements

You need to have installed on your machine: 
* [Node.js](https://nodejs.org)
* [Angular CLI](https://github.com/angular/angular-cli)
* [MongoDB](https://www.mongodb.com)

# Install dependencies

Run `npm install`.

# Configuring the client side - Angular

## Build Angular Client

Run `ng build --prod` to build the project. The build artifacts will be stored in the `dist/` directory.

We need to use the `--prod` flag for a production compilation. This allows us to see in action the `service worker` configured in `ngsw-config.json` to `cache` for performance and freshness.

## Copy the dist/wow content and take it to the server

Create `public` folder inside of `server`. Copy the content on `dist/wow` and paste it on `server/public`.

Now we have our client ready to be dispatched from the Node.js server.


# Configuring the server side - Express Node.js MondoDB

## Create .env file

Create an `.env` file paste inside of it the content of `.env-example` finally add some JWT token like "2BB80D537B1DA3E38BD30361AA855686BDE0EACD7162FEF6A25FE97BF527A25B".

## Run Server
Run the server with  `npm run server` (make sure you have mongodb running).

The first time the server boots, it makes an initial load: it makes the first batch of scraping. Then it will keep a synchronization executing a code how do the scraping once a day at 00:00 hours.

## Open the app
Go to [http://localhost:3000](http://localhost:3000)

# Further help

Contact me :)
