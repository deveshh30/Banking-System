const {Router} = require('express');
const authmiddleware = require('../middleware/auth.middleware');
const transactionController =  require('../controller/transactionn.controller')

const transactionRoutes = Router();

transactionRoutes.post("/" , authmiddleware.authmiddleware , transactionController.createTransaction)

module.exports = transactionRoutesl