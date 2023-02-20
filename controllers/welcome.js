//Dimostrazione API con jwt, in Postman bisogna inviare una header con un paramentro
//"x-access-token" in cui si inserisce il token
//Teoricamente la memorizzazione del token in locale lo fa il front end?

const welcome = (req, res) => {
    console.log("Invoked welcome API");
    res.status(200).send("Welcome!");
}

module.exports = { welcome };