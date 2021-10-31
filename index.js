const express = require('express');
const app = express();
const port = process.env.PORT||7000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1u7a3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('holiday-tour');
        const serviceCollection = database.collection('services');
        const blogsCollection = database.collection('blogs');
        const offersCollection = database.collection('offers');
        const orderCollection = database.collection('order');

        // get all services from database
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // create new services
        app.post('/services',async(req, res)=>{
        	const data = req.body;
        	const result = await serviceCollection.insertOne(data);
        	res.json(result);
        });

        // get all blogs
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

		// get all offers
        app.get('/offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // get single service
        app.get('/service/:id', async (req, res) => {

          	const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // get single blogs
        app.get('/blog/:id', async (req, res) => {

          	const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blog = await blogsCollection.findOne(query);
            res.send(blog);
        });

        // get single offer
        app.get('/offer/:id', async (req, res) => {

          	const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const offer = await offersCollection.findOne(query);
            res.send(offer);
        });

        // post order
        app.post('/order', async(req, res)=>{
			const data = req.body;
			const result = await orderCollection.insertOne(data);
			res.send(result);
        });

        // manage all orders
        app.get('/order', async(req, res)=>{
        	 const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

         // get my order
        app.get('/myorders/:email', async (req, res) => {
        	// const data = req.params.email;
        	// const result = await orderCollection.find({email:req.params.email});
         //    const userorder = result.toArray();
         	const data ={email: req.params.email};
             const result = await orderCollection.find(data).toArray();
			 res.json(result);
        });

        // delete my order
        app.delete('/order/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

        //update status
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('add connection');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})