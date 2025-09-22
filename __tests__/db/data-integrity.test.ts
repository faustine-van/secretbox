
import { createClient } from '@supabase/supabase-js';
import { encrypt } from '@/lib/server/encryption';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe('Data Integrity', () => {
  it('should delete all keys in a collection when the collection is deleted', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or anon key is not defined in environment variables.');
    }

    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');
    const userEmail = `user-${Date.now()}@example.com`;
    const password = 'password123';

    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({ email: userEmail, password, email_confirm: true });
    expect(userError).toBeNull();
    expect(user).toBeDefined();

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({ email: userEmail, password });
    expect(sessionError).toBeNull();
    expect(session).toBeDefined();

    const authedSupabase = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: `Bearer ${session.session.access_token}` } } });

    // Create a collection
    const { data: collection, error: collectionError } = await authedSupabase
      .from('collections')
      .insert({ name: 'Test Collection', user_id: user.user?.id })
      .select()
      .single();
    expect(collectionError).toBeNull();
    expect(collection).toBeDefined();

    const { encryptedValue, iv, authTag, salt } = await encrypt('secret', user.user.id);

    // Create a key in the collection
    const { data: key, error: keyError } = await authedSupabase
      .from('keys')
      .insert({ name: 'Test Key', encrypted_value: encryptedValue, iv, auth_tag: authTag, salt, collection_id: collection.id, user_id: user.user?.id })
      .select()
      .single();
    expect(keyError).toBeNull();
    expect(key).toBeDefined();

    // Delete the collection
    const { error: deleteError } = await authedSupabase
      .from('collections')
      .delete()
      .eq('id', collection.id);
    expect(deleteError).toBeNull();

    // Check that the key is also deleted
    const { data: deletedKey, error: deletedKeyError } = await authedSupabase
      .from('keys')
      .select('*')
      .eq('id', key.id);
    expect(deletedKeyError).toBeNull();
    expect(deletedKey).toHaveLength(0);
  });
});
