import mongoose from "mongoose";
type ConnectionObject = {
    isConnected?:number
}

const Connection:ConnectionObject = {}

async function dbConnect():Promise<void>{
    if(Connection.isConnected){
        console.log("Already connected to database")
        return 
    }
    try{
       // Fallback to MONGO_URI if MONGODB_URI is not set
       const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
       console.log("Attempting to connect to MongoDB with URI length:", uri.length);
       if (!uri) {
           console.error("MONGO_URI is undefined!");
       }
       const db = await mongoose.connect(uri,{ serverSelectionTimeoutMS: 5000 })
       Connection.isConnected = db.connections[0].readyState
       console.log("Database connected successfully!")
    }catch(error){
        console.log("Database connection failed",error)
        throw error;
    }
}

export default dbConnect