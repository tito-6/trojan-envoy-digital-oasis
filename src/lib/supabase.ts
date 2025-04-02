
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ouleltyzacvwhknbcfgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bGVsdHl6YWN2d2hrbmJjZmdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1ODQ3MTIsImV4cCI6MjA1OTE2MDcxMn0.V-OT4Kwfzi-WTNgb5iYbcLCDsH9fRHokT9sbhA04Mjk';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
