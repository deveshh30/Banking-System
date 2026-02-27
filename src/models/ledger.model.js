const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
    {
        account : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "account",
            required : [true , " ledger must be associated with an account"],
            inndex : true,
            immutable : true,
        },
        amount : {
            type : Number,
            required : [ true , "amount is required to create a ledger entry"],
            immutable : true,
        },
        transaction : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "transaction",
            required : [ true , " ledger must be associated with a transaction"],
            index : true,
            immutable : true
        },
        type : {
            type : String,
            enum : {
                values : ["CREDIT" , "DEBIT"],
                message : "type can be either CREDIT or DEBIT"
            },
            required : true,
            immutable : true,
        }

    }
)

function preventLedgerModiication () {
    throw new Error("ledger entries are immutable and cannot be modiied or deleted")
}

ledgerSchema.pre('findOneAndUpdate' , preventLedgerModiication);
ledgerSchema.pre('remove' , preventLedgerModiication);
ledgerSchema.pre('deleteMany' , preventLedgerModiication);
ledgerSchema.pre('deleteOne' , preventLedgerModiication);
ledgerSchema.pre('updateOne' , preventLedgerModiication);

const ledgerModel = mongoose.model('ledger' , ledgerSchema)

module.exports = ledgerModel;