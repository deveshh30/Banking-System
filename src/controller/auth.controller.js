const userModel = require("../models/user.model")

function userRegister(req, res ) {
    const {email , password , name} = req.body;
}

module.exports = {
    userRegister
}