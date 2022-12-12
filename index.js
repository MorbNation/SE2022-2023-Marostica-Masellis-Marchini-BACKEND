require('dotenv').config();
const express=require('express');
const app=express();

app.get("/", (req, res) => {
    res.send(req.headers, req.originalUrl, req.method, req.body);
});

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
});