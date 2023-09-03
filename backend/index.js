const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); 
const mongoose = require('mongoose');
const cookieParsers = require('cookie-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
dotenv.config();

const mongoDB = process.env.MONGODB_URL;
mongoose
    .connect(mongoDB)
    .then(() => {
        console.log("Connected to MongoDB");
    })

    .catch((err) => {
        console.log(err);
    });

app.listen(8000, () => console.log('Server is running'))