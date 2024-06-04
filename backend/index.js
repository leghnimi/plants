require('dotenv').config();
const express = require('express')
const port = 5000
const mongoose = require('mongoose');
const loginRouter = require('./routes/login.router');
const uploadRouter = require('./routes/upload.router');
const plantRouter = require('./routes/plant.router');
const greenhouseRouter = require ('./routes/greenhouse.router')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// cloudinary upload picture
app.use('/api', uploadRouter)

// login router
app.use('/api', loginRouter);

// plant router
app.use('/api', plantRouter);

// greenhouse router
app.use('/api', greenhouseRouter)

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gzz2k7b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Connected!')
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }).catch(err => console.log(err));