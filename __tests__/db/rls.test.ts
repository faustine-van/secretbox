
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

describe('RLS Policy Validation', () => {
  it('should prevent a user from accessing another user\'s data', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or anon key is not defined in environment variables.');
    }

    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');
    const user1Supabase = createClient(supabaseUrl, supabaseAnonKey);
    const user2Supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Create two users
    const user1Email = `user1-${Date.now()}@example.com`;
    const user2Email = `user2-${Date.now()}@example.com`;
    const password = 'password123';

    const { data: user1, error: user1Error } = await supabaseAdmin.auth.admin.createUser({ email: user1Email, password, email_confirm: true });
    expect(user1Error).toBeNull();
    expect(user1).toBeDefined();

    const { data: user2, error: user2Error } = await supabaseAdmin.auth.admin.createUser({ email: user2Email, password, email_confirm: true });
    expect(user2Error).toBeNull();
    expect(user2).toBeDefined();

    const { data: session1, error: session1Error } = await user1Supabase.auth.signInWithPassword({ email: user1Email, password });
    expect(session1Error).toBeNull();
    expect(session1).toBeDefined();

    const { data: session2, error: session2Error } = await user2Supabase.auth.signInWithPassword({ email: user2Email, password });
    expect(session2Error).toBeNull();
    expect(session2).toBeDefined();

    const user1SupabaseAuthed = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: `Bearer ${session1.session.access_token}` } } });
    const user2SupabaseAuthed = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: `Bearer ${session2.session.access_token}` } } });

    // Create a collection for user 1
    const { data: collection, error: collectionError } = await user1SupabaseAuthed
      .from('collections')
      .insert({ name: 'User 1 Collection', user_id: user1.user?.id })
      .select()
      .single();
    expect(collectionError).toBeNull();
    expect(collection).toBeDefined();

    // User 2 attempts to access user 1's collection
    const { data: accessedCollection, error: accessError } = await user2Supabase
      .from('collections')
      .select('*')
      .eq('id', collection.id);

    expect(accessError).toBeNull();
    expect(accessedCollection).toHaveLength(0);
  });
});
