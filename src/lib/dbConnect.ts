import mongoose  from 'mongoose';


type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
        console.log(db, db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log('New database connection established');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); 

    }
}


export default dbConnect;