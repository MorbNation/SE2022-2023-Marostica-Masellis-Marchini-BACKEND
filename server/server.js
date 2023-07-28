// Dependencies
require('dotenv').config();
const YAML = require('yamljs');
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const app = express();
const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerDocument = YAML.load('./swagger.yaml');
var cookieParser = require('cookie-parser');
const cors = require('cors');

// Bindings
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.static('src/assets'));
app.use(fileUpload());

// Establish connection with the database
mongoose.connect(
    process.env.DB_TOKEN,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is: ", mongoose.connection.readyState);
    }
);

app.get("/", (req, res) => {
    res.send(req.headers, req.originalUrl, req.method, req.body);
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});

// Imports the APIs routes
const routesPost = require('./routes/post');
const routesUtente = require('./routes/utente');
const routesCommento_Post = require('./routes/commento_post');
const routesCommento_Profilo = require('./routes/commento_profilo');
const routesUpload = require('./routes/upload');

// Binds the APIs and the documentation module
app.use('/', routesPost, routesUtente, routesCommento_Post, routesCommento_Profilo, routesUpload);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));