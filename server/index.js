const express = require('express');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const cors = require('cors');
const path = require('path');

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

// starting server
async function start () {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${server.address().port}`));
}
start();