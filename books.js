require('dotenv').config({ path: '.env'});
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const dbName = 'test';

async function main(){
    const client = new MongoClient(url);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate DB calls
        await listDatabases(client);
        // insert a new listing
        await createListing(client, {
            title: "Life",
            author: "John Doe",
            year: 2001,
        });
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing){
    const result = await client.db(dbName).collection("books").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}
