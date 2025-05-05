import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

if (typeof window === 'undefined') {
  // Load environment variables
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trojan_envoy_db',
  connectionLimit: 10, // Adjust as needed
};

const pool = mysql.createPool(dbConfig);

import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface QueryResult {
  [index: number]: RowDataPacket[] | ResultSetHeader;
}

export async function executeQuery<T = RowDataPacket>({ query, values }: { query: string, values?: any[] }): Promise<T[]> {
  try {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute<QueryResult>(query, values);
      const rows = results[0] as T[];
      return rows;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Database query error:', error);
    throw new Error(error.message || 'Database query failed');
  }
}

export default pool;
