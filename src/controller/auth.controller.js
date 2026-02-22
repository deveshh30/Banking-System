const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

// * - user register controller
// * - POST/ api/auth/register
async function userRegister(req, res ) {
    const {email , password , name} = req.body;

    const isExists = await userModel.findOne({
        email : email
    })

    if(isExists) {
        return res.status(422).json({
            message : "User already exists with email",
            status : "failed"
        })
    }

    const user = await userModel.create({
        email , password , name
    })

    const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET , {expiresIn : '3d'})  

    res.cookie("token" , token)

    res.status(201).json({
        user : {
            _id : user._id,
            email : user.email,
            name : user.name
        }, token
    })
}

// * - User Login Controller
//  POST/ api/auth/login
async function userLogin(req,res) {
     const { email , password } = req.body;
     const user = await userModel.findOne({email})

     if(!user) {
        return res.status(401)
        .json({
            message : "Email or password is invalid"
        })
     }

     const isValidPassword = user.comparePassword(password)

     if(!isValidPassword) {
      return res.status(401)
        .json({
            message : "Email or password is invalid"
        })  
     } 

    const token = jwt.sign({userId : user._id} , process.env.JWT_SECRET , {expiresIn : '3d'})  

    res.cookie("token" , token)

    res.status(200).json({
        user : {
            _id : user._id,
            email : user.email,
            name : user.name
        }, token
    })
}

module.exports = {
    userRegister,
    userLogin
}