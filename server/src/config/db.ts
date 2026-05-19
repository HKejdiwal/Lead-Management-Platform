import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    return mongoose.connect(mongoUri, { dbName: 'smart-leads' });
  }

  mongoServer = await MongoMemoryServer.create();
  const inMemoryUri = mongoServer.getUri();
  return mongoose.connect(inMemoryUri, { dbName: 'smart-leads' });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
