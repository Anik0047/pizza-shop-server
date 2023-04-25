const express = require('express');
const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xk3xa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const pizzaCollection = client.db('dbpizza').collection('pizza');
        const blogCollection = client.db('dbpizza').collection('blog');
        const userCollection = client.db('dbpizza').collection('user');

        // GET OPERATION
        app.get('/pizza', async (req, res) => {
            const query = {};
            const pizza = await pizzaCollection.find(query).toArray();
            res.send(pizza);
        });


        app.get('/blog', async (req, res) => {
            const query = {};
            const blog = await blogCollection.find(query).toArray();
            res.send(blog);
        });

        // POST OPERATION

        //Pizza

        app.post('/addPizza', async (req, res) => {
            const pizza = req.body;
            const result = await pizzaCollection.insertOne(pizza);
            res.send(result);
        })

        //User
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        //BLog

        app.post('/addBlog', async (req, res) => {
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            res.send(result);
        })

        // DELETE OPERATION 
        app.delete('/pizza/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await pizzaCollection.deleteOne(filter);
            res.send(result);
        });


        app.delete('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await blogCollection.deleteOne(filter);
            res.send(result);
        });

    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
})


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})