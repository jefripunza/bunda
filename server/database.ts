/* eslint-disable @typescript-eslint/no-unused-vars */

import { mongodb, knex, mongoUnit } from "./deps";
import {
  // MongoDB
  MONGO_NAME,
  MONGO_URL,

  // SQL
  DB_TYPE, // mysql, postgres, mssql
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
} from "./environments";

// ================================================= //

export const useMongoDB = async <T>(
  cb: (db: mongodb.Db) => Promise<T>
): Promise<{ success: boolean; result?: T; message?: string }> => {
  const client = new mongodb.MongoClient(MONGO_URL());
  try {
    await client.connect();
    const db = client.db(MONGO_NAME());
    return {
      success: true,
      result: await cb(db),
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to MongoDB:${error.message}`,
    };
  } finally {
    await client.close();
  }
};

export const useSQL = async <T>(
  cb: (db: knex.Knex) => Promise<T>
): Promise<{ success: boolean; result?: T; message?: string }> => {
  const db = knex({
    client: DB_TYPE,
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    },
  });

  try {
    return {
      success: true,
      result: await cb(db),
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to connect to SQL database:${error.message}`,
    };
  } finally {
    await db.destroy();
  }
};
