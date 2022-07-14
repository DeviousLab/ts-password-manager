import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

import logger from './logger';
import { MONGODB_URI } from '../constants';

export function gracefulShutdown(signal: string, app: FastifyInstance) {
  process.on(signal, async () => {
    logger.info(`Received ${signal}`);
    app.close();
    await disconnectFromDb();
    logger.info('Server closed');
    process.exit(0);
  });
}

export async function connectToDb() {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    logger.error(error, "Couldn't connect to database");
    process.exit(1);
  }
}

export async function disconnectFromDb() {
  await mongoose.connection.close();
  logger.info("Disconnected from database");
  return;
}