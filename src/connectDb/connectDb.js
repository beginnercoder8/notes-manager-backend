const mongoose = require("mongoose")

const connectDb = async() =>{
    try{
      const connection = await mongoose.connect(process.env.CONNECTION_URL,{
        dbName: 'notes-manager'
      });
      console.log(`connected to db`)
    } catch(err) {
        console.log(err)
    }
}

module.exports = connectDb;