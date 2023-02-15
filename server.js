require('dotenv').config();
const YAML = require('yamljs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const tokenChecker = require('./tokenChecker');
const swaggerUI = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());

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
const routesPost = require('./routes/post', tokenChecker);
const routesUser = require('./routes/utente');
const routesAuth = require('./routes/auth');
const routesComment = require('./routes/comment');
app.use('/', routesPost, routesUser, routesAuth, routesComment);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));