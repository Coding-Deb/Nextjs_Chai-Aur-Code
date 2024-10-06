import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected");
    return;
  }
  try {
    // const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    const db = await mongoose.connect("mongodb+srv://debanshubrahma1234:fakemessage@cluster0.oef90.mongodb.net/");

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Connection Failed ---", error);
    process.exit(1);
  }
}

export default dbConnect