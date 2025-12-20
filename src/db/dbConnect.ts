import mongoose from "mongoose";

type ConnectionStatus = {
    isConnected?: number
}

const Connections : ConnectionStatus = {}

const DB_URI = process.env.MONGODB_URI!

if(!DB_URI){
    console.error("DB link missing")
}

export const dbConnect = async () => {

    if(Connections.isConnected){
        console.log("DB already Connected")
        return;
    }

    try {

        const response = await mongoose.connect(`${DB_URI}`)

        Connections.isConnected = response.connections[0].readyState

        console.log("Database connected successfully")

    } catch (error : any) {
        console.error("Error while connecting to database", error.message)
        process.exit(1)
    }

}
