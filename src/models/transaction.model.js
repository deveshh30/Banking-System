const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        sendersAccount : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "account" , 
            required : [true , "transaction must be associated with a sender's account"],
            index : true
        },
        receiverAccount : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "account" , 
            required : [true , "transaction must be associated with a reciever's account"],
            index : true
        },
        status : {
            type : String,
            enum : {
                values :["PENDING" , "COMPLETED" , "FAILED" , "REVERSED"],
                message : "Status can be either pending , completed , failed , reversed",
            },
            default : "PENDING"
        },
        amount : {
            type : Number,
            required : [true, "amount is required or creating a transaction"],
            min : [1 , "transaction amount can not be less than 1"]
        },
        idempotancyKey : {
            type : String,
            required : [true , "idempotancy key is required or creating a transaction"],
            index : true,
            unique : true
        },



    } , {timestamps : true}
)

const transactionModel = mongoose.model("transaction" , transactionSchema)

module.exports = transactionModel