const express =require('express');
const { MongoClient } = require('mongodb');
const cors =require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app =express();
const port = 5000;


//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhekc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        await client.connect();
        const database = client.db('GeniousCar');
        const servicesCollection = database.collection('theServices');

        //GET ALL DATA
        app.get('/services' , async(req ,res) => {
                const cursor = servicesCollection.find({});
                const services = await cursor.toArray();
                res.send(services);
        });

        //GET SINGLE SERVICE
        app.get('/services:id', async(req ,res) =>{
            const id = req.params.id;
            console.log('the single id is: ', id);
            const query ={_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        });


        //POST API
        app.post('/services' , async(req ,res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result)
        })
    }

    finally{
      //  await client.close();
    }
}
run().catch(console.dir)











app.get('/' ,(req ,res) => {
    res.send("hello world")
});
app.listen(port, () =>{
        console.log("running genious server" , port);
});

