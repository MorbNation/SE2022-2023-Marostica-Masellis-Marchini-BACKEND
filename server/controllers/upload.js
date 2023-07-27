//Upload API

const path = require('path');

const upload = (req, res) => {
    console.log("Upload invoked");

    if(!req.files){
        return res.status(500).send({ msg: "file not found" });
    }

    const file = req.files.file;
    const parentDir = path.resolve(__dirname, '../..');
    
    file.mv(`${parentDir}/src/assets/${file.name}`, (err) =>{
        if(err){
            console.error(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        return res.json({ name: file.name, path: `./assets/${file.name}`});
    });
};

module.exports = { upload };