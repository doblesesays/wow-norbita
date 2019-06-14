const express = require('express');
const { productRoutes, syncProducts } = require('./routes/product');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

app = express();

// passport
// Passport
app.use(passport.initialize());
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// cors
app.use(cors());

// Client
app.use(express.static(path.join(__dirname, "public")));

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', userRoutes);
app.use('/api', productRoutes);
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// setting and connecting mongoose
mongoose.Promise = global.Promise;

/* cron.schedule('* * * * *', () => {
	console.log('Printing this line every minute in the terminal');
}); */

// Sync new data from AppliancesDelivered.ie every day at 1750 Hours London Time.
cron.schedule('50 17 * * *', () => {
    console.log('Sync new data from AppliancesDelivered.ie');
    syncProducts();
}, {
	scheduled: false,
    timezone: "Europe/London"
});

// starting the server and fullfilled the database with products
async function start () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    await syncProducts();
    const server = app.listen(process.env.PORT || 3000, () => console.log(`Server ready and database fullfilled. Listening on port ${server.address().port}.`));
}

start();