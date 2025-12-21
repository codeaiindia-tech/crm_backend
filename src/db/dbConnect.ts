import mongoose from "mongoose";

type ConnectionStatus = {
  isConnected?: number;
};

const Connections: ConnectionStatus = {};

export const dbConnect = async () => {
  const DB_URI = process.env.MONGODB_URI;

  if (!DB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (Connections.isConnected) {
    console.log("DB already connected");
    return;
  }

  try {
    const response = await mongoose.connect(DB_URI);

    Connections.isConnected = response.connections[0].readyState;

    console.log("Database connected successfully");
  } catch (error: any) {
    console.error("Error while connecting to database:", error.message);
    process.exit(1);
  }
};
