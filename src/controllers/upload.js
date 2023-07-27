//Upload API

const upload = (req, res) => {
    if(!req.files){
        return res.status(500).send({ msg: "file not found" });
    }

    const file = req.files.file;
    
    file.mv(`${__dirname}/assets/${file.name}`, (err) =>{
        if(err){
            console.error(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        return res.json({ name: file.name, path: `./assets/${file.name}`});
    });
};

module.exports = { upload };