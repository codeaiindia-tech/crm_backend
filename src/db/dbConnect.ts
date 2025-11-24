import mongoose from "mongoose";

type Connection = {
    isConnected?: number 
}

const Connections : Connection = {}

const DB_URI = process.env.MONGODB_URI!

if(!DB_URI){
    console.log("DB link missing")
}

export const dbConnect = async () => {

    if(Connections.isConnected){
        console.log("DB already Connected")
    }

    try {
        
        const response = await mongoose.connect(`${DB_URI}`)

        Connections.isConnected = response.connections[0].readyState

        console.log("Database connected successfully")

    } catch (error : any) {
        console.log("Error while connecting to database", error.message)
    }

}