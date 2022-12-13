require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
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

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

const routes = require('./routes/post');
app.use('/', routes);