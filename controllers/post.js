const newPost = (req, res, next) => {
    //placeholder per database shit
    res.json({message: "POST new post"});
};

const getPost = (req, res, next) => {
    //placeholder per database shit
    res.json({message: "GET post"});
};

const deletePost = (req, res, next) => {
    //placeholder per database shit
    res.json({message: "DELETE post"});
};

module.exports = {newPost, getPost, deletePost};