require('dotenv').config();
const express =  require('express');
const mongoose = require('mongoose');
const app=express();

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

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
});

const routes = require('./routes/post');
app.use('/', routes);