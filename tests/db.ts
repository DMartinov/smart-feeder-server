import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

export default {
    /**
        * Connect to the in-memory database.
     */
    connect: async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();

        const mongooseOpts = {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        };

        console.debug('Connecting');
        try {
            await mongoose.connect(uri, mongooseOpts);
            console.debug('Connected');
        } catch (ex) {
            console.error('Connecting to the in-memory database failed');
        }

    },
    /**
        * Drop database, close the connection and stop mongod.
    */
    closeDatabase: async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    },

    /**
        * Remove all the data for all db collections.
    */
    clearDatabase: async () => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
};
