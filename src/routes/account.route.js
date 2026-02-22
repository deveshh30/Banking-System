const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router()




// PORT /api/accounnts/ create a new account 
router.post("/" , authMiddleware)


module.exports = router