const { collection } = require("../models/commento_profilo");
const Commento_Profilo = require("../models/commento_profilo");

const newCommento_Profilo = async (req, res) => {
    console.log(req.body);
    console.log('Trying to add new comment...');

    const newCommento_Profilo = new Commento_Profilo({
        id: req.body.id,
        profilo_commentato: req.body.profilo_commentato,
        titolo: req.body.titolo,
        data: req.body.data,
        testo: req.body.testo,
        punteggio: 0,
        segnalato: false,
        creatore_commento: req.body.creatore_commento
    });

    newCommento_Profilo.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    });
};

const getCommento_Profilo = (req, res) => {
    console.log(req.params);
    let profiloAssoc = req.params.profilo_commentato;
    var query = { profilo_commentato: profiloAssoc };
    console.log(`Getting comment with association id ${profiloAssoc}...`);

    Commento_Profilo.find(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with association id ${profiloAssoc} retrieved successfully.`);
            return res.json(collection);
        }
    });
};

const deleteCommento_Profilo = (req, res) => {
    console.log(req.params);
    let commentId = req.params.id;
    var query = { id: commentId };
    console.log(`Deleting comment with id ${commentId}...`);

    //delete è stupida e a quanto pare non ritorna se la cosa che si prova ad eliminare non esiste, bisognerebbe
    //fare una retireve di support ma chi ha voglia
    Commento_Profilo.deleteMany(query, (err, collection) => {
        if (err) {
            throw err;
        } else {
            console.log(`Comment with id ${commentId} deleted succesfully.`);
            res.json({ message: "DELETE Comment" });
        }
    });
};

module.exports = { newCommento_Profilo, getCommento_Profilo, deleteCommento_Profilo };