const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const user = process.env.db_user;
const password = process.env.db_password;

//The user and password were taken from env
const uri = `mongodb+srv://${user}:${password}@cluster0.bs7nnrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Two collection is used
async function run() {
    try {

        const taskCollection = client.db('TaskManagement').collection('mytask');
        const completedCollection = client.db('TaskManagement').collection('completed');
        const commentCollection = client.db('TaskManagement').collection('comment');

        app.post('/addtask', async (req, res) => {
            const task = req.body;
            // console.log(task);
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });

        app.get('/mytask/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email:email };
            const task = await taskCollection.find(query).toArray();
            // console.log(laptops);
            res.send(task);
        });


        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };

            const result = await taskCollection.deleteOne(query);

            res.send(result);
        })

        app.put('/updateTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const Item = req.body;
            console.log(id);
            const options = { upsert: true };
            const updatedItem = {
                $set: {
                    message:Item.message,
                    image:Item.image,
                }
            }
            const result =await taskCollection.updateOne(query, updatedItem,options);
            res.send(result);
        });

        app.post('/addCompleted/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            
            const temp = await taskCollection.findOne(query);

            const result =await completedCollection.insertOne(temp);
            const deleting = await taskCollection.deleteOne(query);
            res.send(result);
        });


        app.get('/completed/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email:email };
            const task = await completedCollection.find(query).toArray();
            // console.log(laptops);
            res.send(task);
        });

        app.delete('/deleteCompleted/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };

            const result = await completedCollection.deleteOne(query);

            res.send(result);
        })

       
        app.post('/addtasktoCompleted/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            
            const temp = await completedCollection.findOne(query);

            const result =await taskCollection.insertOne(temp);
            const deleting = await completedCollection.deleteOne(query);
            res.send(result);
        });

        app.post('/comment', async (req, res) => {
            const comment = req.body;
             console.log(comment);
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });

        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { comment_id:id };
            const task = await commentCollection.find(query).toArray();
            // console.log(laptops);
            res.send(task);
        });
        

    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})