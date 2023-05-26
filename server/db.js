// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://xuantai:xuantai1911@cluster-todolist.4ol6fmd.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         // await client.close();
//     }
// }
// run().catch(console.dir);

// module.exports = client;

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