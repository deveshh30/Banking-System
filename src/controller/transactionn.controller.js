const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accoundModel = require("../models/account.model")
const emailService = require("../service/email.service")
const mongoose = require("mongoose")

async function createTransaction(req , res) {
    //1
    const { sendersAccount , receiverAccount , idempotancyKey , amount} = req.body

    if(!sendersAccount || !receiverAccount || !amount || !idempotancyKey) {
        return res.status(400).json({
             message : "all stats are required"
        })
    }
    
    const senderAccount = await accoundModel.findOne({_id : sendersAccount})


    const receiversAccount = await accoundModel.findOne({_id : receiverAccount})

    if(!senderAccount || !receiversAccount) {
        return res.status(404).json({
            message : "sender or reciever account not found"
        })
    }

    //2
    const isTransactionAlreadyExist = await transactionModel.findOne({idempotancyKey : idempotancyKey})

    if(isTransactionAlreadyExist) {
        if(isTransactionAlreadyExist.status == "COMPLETED"){
        return res.status(409).json({
            message : "transaction already proceded",
            transaction : isTransactionAlreadyExist
        })}

        if(isTransactionAlreadyExist.status == "PENDING"){
        return res.status(200).json({
            message : "transaction is still processing",
        })}

        if(isTransactionAlreadyExist.status == "FAILED"){
        return res.status(500).json({
            message : "transaction failed",
        })}
        if(isTransactionAlreadyExist.status == "REVERSED"){
        return res.status(500).json({
            message : "transaction was reversed",
        })}

    
    }

    //3

    if(senderAccount.status != "ACTIVE" || receiverAccount.status != "ACTIVE"){
        return res.status(400).json ({
            message : "both senders and reciever account should be active"
        })
    }

    //4 get senders balance

    const balance = await fromUserAccount.getBalance();

    if(balance < amount ) {
        res.status(400)
        .json({
            message : `Insufficient balance, current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    //5 generate transaction

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        sendersAccount,
        receiverAccount,
        amount,
        idempotancyKey,
        status : "PENDING"
    },  {session})

    const debitLedgerEntry = await ledgerModel.create({
        account : sendersAccount,
        amount : amount ,
        transaction : transaction._id,
        type : "DEBIT"
    }, {session })

    const creditLedgerEntry = await ledgerModel.create({
        account : receiverAccount,
        amount : amount ,
        transaction : transaction._id,
        type : "CREDIT"
    }, {session })

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    sessionn.endSession()


}



// 1. validate the request ,
// 2. validate idempotancy key ,
// 3. validate sender and reciever account ,
// 4. validate sender account balance ,
// 5. create transaction with pending status ,
// 6. debit sender account and credit reciever account ,
// 7. update transaction status to completed or failed based on the result of debit and credit operation ,
// 8. create ledger entry for the transaction ,
// 9. send email notification to both sender and reciever about the transaction status