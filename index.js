const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const app = express();

dotenv.config();


app.use(express.json());

// database connection with mongoose
mongoose.connect('mongodb://localhost/todos')
        .then(() => console.log("Connection Successful!"))
        .catch(err => console.log(err))


app.use('/todo', todoHandler);
app.use('/user', userHandler);


const errorHandler = (err, req, res, next) => {
    if(res.headerSent){
        return next(err)
    }
    res.status(500).json({error : err});
}
app.use(errorHandler)

app.listen(3000, ()=>{
    console.log('App Listening at port 3000..');
});


