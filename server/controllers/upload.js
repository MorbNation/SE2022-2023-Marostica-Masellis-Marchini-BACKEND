//Upload API

const path = require('path');

const upload = (req, res) => {
    console.log("Upload invoked");

    if(!req.files){
        return res.status(500).send({ Error: "file not found" });
    }

    const file = req.files.file;
    const parentDir = path.resolve(__dirname, '..');
    
    file.mv(`${parentDir}/media/${file.name}`, (err) =>{
        if(err){
            console.error(err);
            return res.status(500).send({ Error: "Error occured" });
        }
        return res.status(201).json({ name: file.name, path: `./media/${file.name}`});
    });
};

module.exports = { upload };