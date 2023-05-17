require('dotenv').config();
const YAML = require('yamljs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerDocument = YAML.load('./swagger.yaml');
var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

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

//Questa cosa è un po' stupida, si potrebbe mettere tutto in un unico file e poi importare solo quel file
const routesPost = require('./routes/post');
const routesUtente = require('./routes/utente');
const routesCommento_Post = require('./routes/commento_post');
const routesCommento_Profilo = require('./routes/commento_profilo');
const routesAuth = require('./routes/welcome');

app.use('/', routesPost, routesUtente, routesCommento_Post, routesCommento_Profilo, routesAuth);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));