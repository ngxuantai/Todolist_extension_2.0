const mongoose = require('mongoose');
const uri = "mongodb+srv://xuantai:xuantai1911@cluster-todolist.4ol6fmd.mongodb.net/?retryWrites=true&w=majority";

async function connectionDB(){
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(
            uri,
            connectionParams
        );
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
    }
}

module.exports = connectionDB;
