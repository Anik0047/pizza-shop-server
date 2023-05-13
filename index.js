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
        const contactCollection = client.db('dbpizza').collection('contact');
        const orderCollection = client.db('dbpizza').collection('order');
        const commentsCollection = client.db('dbpizza').collection('comment');


        // VERIFY ADMIN
        // const verifyAdmin = async (req, res, next) => {
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await userCollection.findOne(query);
        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ message: 'Forbidden Access' })
        //     }
        //     next();
        // }

        // GET OPERATION
        app.get('/pizza', async (req, res) => {
            const query = {};
            const pizza = await pizzaCollection.find(query).toArray();
            res.send(pizza);
        });


        app.get('/user', async (req, res) => {
            const query = {};
            const user = await userCollection.find(query).toArray();
            res.send(user);
        });


        app.get('/order', async (req, res) => {
            const query = {};
            const order = await orderCollection.find(query).toArray();
            res.send(order);
        });


        app.get('/blog', async (req, res) => {
            const query = {};
            const blog = await blogCollection.find(query).toArray();
            res.send(blog);
        });

        app.get('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const users = await blogCollection.find(query).toArray();
            res.send(users);
        });



        app.get('/comments', async (req, res) => {
            const query = {};
            const users = await commentsCollection.find(query).toArray();
            res.send(users);
        });

        app.get('/mycomments', async (req, res) => {
            const email = req.query.email;
            const decodedEmail = req.decoded.email;

            if (email !== decodedEmail) {
                return res.status(403).send({ message: 'Forbidden access' })
            }
            const query = {
                userEmail: email
            }
            const comments = await commentsCollection.find(query).toArray();
            res.send(comments);
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

        // Contact

        app.post('/contact', async (req, res) => {
            const contact = req.body;
            const result = await contactCollection.insertOne(contact);
            res.send(result);
        })

        // Order

        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

        // Comments

        app.post('/comments', async (req, res) => {
            const comments = req.body;
            console.log(comments);
            const result = await commentsCollection.insertOne(comments);
            res.send(result);
        })

        // orderplace

        app.post('/orderPlace', async (req, res) => {
            const orderPlace = req.body;
            console.log(orderPlace);
            const result = await ordersCollection.insertOne(orderPlace);
            res.send(result);
        })



        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/myorders', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const orders = await orderCollection.find(query).toArray();
            res.send(orders);
        });


        app.put('/user/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

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


        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        });

        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await orderCollection.deleteOne(filter);
            res.send(result);
        });

        app.delete('/mycomments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await commentsCollection.deleteOne(filter);
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