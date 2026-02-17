const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.MONGODB_URL)

    .then(() => {
        console.log(" connected to the database");
        
    })
    .catch(err => {
        console.log("Error connnecting to the database")
        process.exit(1)
        
    })
    
}

module.exports = connectDB;