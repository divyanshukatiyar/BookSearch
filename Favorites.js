require("dotenv").config({ path: ".env" });
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

class Favorite {
  static async add(bookId) {
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('favorites');
      const result = await collection.insertOne({ bookId });
      return result.ops[0];
    } catch (err) {
      console.error(err.message);
    } finally {
      await client.close();
    }
  }

  static async getAll() {
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('favorites');
      const cursor = collection.find();
      const favorites = await cursor.toArray();
      return favorites;
    } catch (err) {
      console.error(err.message);
    } finally {
      await client.close();
    }
  }

  static async remove(id) {
    try {
      await client.connect();
      const database = client.db('test');
      const collection = database.collection('favorites');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (err) {
      console.error(err.message);
    } finally {
      await client.close();
    }
  }
}

module.exports = Favorite;
