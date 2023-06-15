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

app.use(express.json());
app.use(cookieParser());
app.use(cors());

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
app.use(fileUpload());

//Upload API

app.post('/api/upload', (req, res) => {
    if(!req.files){
        return res.status(500).send({ msg: "file not found" });
    }

    const file = req.files.file;
    
    file.mv(`./src/assets/${file.name}`, (err) =>{
        if(err){
            console.error(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        return res.send({ name: file.name, path: `./assets/${file.name}`});
    });
});