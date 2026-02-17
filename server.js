require ("dotenv").config
const app = require("./src/app.js");
const connectDB = require("./src/config/db.js")

app.listen( 3000 , () => {
    console.log("server is running at port 3000");
    
})