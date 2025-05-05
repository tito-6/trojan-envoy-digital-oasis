import db from './mysql';
import { supabase } from '../supabase';

export const checkMySQLConnection = async () => {
  try {
    const result = await db.query('SELECT 1 as connected');
    await db.end();
    console.log('Successfully connected to MySQL');
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error);
    return false;
  }
};

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('footer_settings').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};