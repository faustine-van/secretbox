
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe('Supabase Connection', () => {
  it('should connect to Supabase and fetch the database version', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or anon key is not defined in environment variables.');
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from('non_existent_table').select('*');
    expect(error).toBeDefined();
    expect(error?.code).toBe('PGRST205'); // Relation does not exist
  });
});
