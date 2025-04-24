const mongoose = require("mongoose");

exports.DBConncetion = () => {
    mongoose.connect(process.env.DB_CONNECTION_URI)
        .then((connected) => {
            console.log(`database connected successfully in ${connected.connection.host}`);
        })
} 
