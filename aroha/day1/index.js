// Libraries
const express = require('express');
var bodyParser = require('body-parser');  // MiddleWare
const mongoose = require('mongoose');

// Import Routes
const loginflow= require('./server/routes/login/login')
const DBConfig= require('./server/shared/db');
const AuthModule= require('./server/shared/auth')
// Instances
const app= express();

// Instance of Mongoose/MongoDB | TO BE DONE ONLY ONCE
mongoose.Promise = global.Promise;
mongoose.connect(DBConfig.url, { useNewUrlParser: true, reconnectTries: DBConfig.retry, noDelay: true })
    .then(() => {
        console.log('Connection Successful');
    }).
    catch((err) => {
        console.log('Connection Failed', err);
    });

// Global Middlewares
// To read URL Encoded and Upload Files  using Post/PUT request
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false, parameterLimit: 50000 }));

app.use(AuthModule.passport.initialize());

// APIS
app.get('/',(req,res)=>{
    return res.send("Hey its Express");
});

app.use('/auth',loginflow);

// SERVER BEGIN
let server=app.listen(5000,()=>{
    console.log('Server has Started');
    console.log('Using the Server Address as',server.address().address);
    console.log('Using the Port',server.address().port);
});



