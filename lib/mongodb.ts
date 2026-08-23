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
       const db = await mongoose.connect(uri,{})
       Connection.isConnected = db.connections[0].readyState
       console.log("Database connected successfully!")
    }catch(error){
        console.log("Database connection failed",error)
        process.exit(1)
    }
}

export default dbConnect