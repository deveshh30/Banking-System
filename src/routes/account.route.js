const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controller/account.controller")

const router = express.Router()




// POST /api/accounts/ create a new account 
router.post("/" , authMiddleware , accountController.createAccount)



module.exports = router 