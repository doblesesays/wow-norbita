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
sync = express();

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

// starting the client instance
async function start () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    const server = app.listen(process.env.PORT_SERVE || 3000, () => console.log(`Server ready. Listening on port ${server.address().port}.`));
}

start().then(() => {
    // Strarting the Scraping instance
    sync.listen(process.env.PORT_SYNC || 8000, async () => {
        // Check if the initial load was already made (for development purposes)
        if (await mongoose.connection.db.collection('products').countDocuments() < 1) {
            await syncProducts();
        }
        
        // Sync new data from AppliancesDelivered.ie EVERY DAY at 00:00 Hours.
        cron.schedule('0 0 * * *', async () => {
            console.log('Sync new data from AppliancesDelivered.ie');
            await syncProducts();
        }, {
            scheduled: false,
            timezone: "Europe/London"
        });

        // every minute (for development purposes) 
        /* cron.schedule('* * * * *', async () => {
            console.log('Sync new data from AppliancesDelivered.ie');
            await syncProducts();
        }, {
            scheduled: false,
            timezone: "Europe/London"
        }); */
    });
})
