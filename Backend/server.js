require("dotenv").config({ path: ".env" });
const express = require('express');
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = process.env.MONGODB_URI;
const router = express.Router();
const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('books');
        const cursor = collection.find();
        const results = await cursor.toArray();
        res.send(results);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

// add search functionality to find any book
router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('books');
        const books = await collection.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { year: { $regex: query, $options: 'i' } },
            ],
        });
        const array = await books.toArray();
        res.json(array);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

// add the "add to favorites" functionality to add a book to the favorites collection
router.post('/favorites/add', async (req, res) => {
    const bookId = new ObjectId(req.query.f);
    try {
        await client.connect();
        const database = client.db('test');
        const booksCollection = database.collection('books');
        const favoritesCollection = database.collection('favorites');
        const book = await booksCollection.findOne({ _id: bookId });
        const result = await favoritesCollection.insertOne(book);
        res.json(result.acknowledged);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

// add the "remove from favorites" functionality to remove a book from the favorites collection
router.delete('/favorites/remove', async (req, res) => {
    const bookId = new ObjectId(req.query.f);
    try {
        await client.connect();
        const database = client.db('test');
        const collection = database.collection('favorites');
        const result = await collection.deleteOne({ _id: bookId });
        res.json(result.deletedCount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

router.get('/favorites', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('test');
        const favoritesCollection = database.collection('favorites');
        const cursor = favoritesCollection.find();
        const results = await cursor.toArray();
        res.send(results);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = router;