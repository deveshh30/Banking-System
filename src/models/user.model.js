const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema
({
    email : {
        type : String,
        required : [true , "Email is required for creating a account"],
        trim : true,
        lowercase : true,
        unique : [true, "email already exists"],
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },

    name : {
        type : String,
        required : [true, "user's name is required to create a account"],

    },
    password : {
        type : String,
        required : [true, "password is required to create a account"],
        minlength : [6, "password must contain 6 or more letters"],
        select : false,
    }
}, {timestamps : true})


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    
});



userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password , this.password)
}

const userModel = mongoose.model("user" , userSchema)

module.exports = userModel