const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config({path: './src/config/.env'});
const pvRoutes = require ('./src/routes/pv.routes');

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,',
    'preflightContinue': false 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api-pv', pvRoutes);


//le port
app.listen(5000, () => 
    console.log(`Server started in port 5000`
));