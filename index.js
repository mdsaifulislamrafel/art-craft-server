const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2lraink.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //   await client.connect();

    const productCollections = client.db('productDB').collection('product');

    app.get('/added', async (req, res) => {
      const products = await productCollections.find({}).toArray();
      res.send(products);
    })


    app.get('/added/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.get('/myProduct/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await productCollections.find(query).toArray();
      res.send(result);
    })

    app.post('/added', async (req, res) => {
        const product = req.body;
        const result = await productCollections.insertOne(product);
        res.send(result);
    })


    app.put('/added/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = {upsert: true };
      const update = req.body;
      const updateDoc = {
        $set: {
          image: update.image,
          item: update.item,
          subcategory: update.subcategory,
          shortDescription: update.shortDescription,
          price: update.price,
          rating: update.rating,
          customization: update.customization,
          processing_time: update.processing_time,
          stockStatus: update.stockStatus
        }
      }
      const result = await productCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    app.delete('/added/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.deleteOne(query);
      res.send(result);
    });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})