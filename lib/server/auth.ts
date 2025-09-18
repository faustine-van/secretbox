
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { Profile } from '@/types/supabase';
import * as bcrypt from 'bcrypt';

export async function getServerSession() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function validateMasterPassword(userId: string, masterPassword: string): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('master_password_hash')
    .eq('id', userId)
    .single();

  if (error || !profile || !profile.master_password_hash) {
    return false;
  }

  return bcrypt.compare(masterPassword, profile.master_password_hash);
}

export async function createUserProfile(userId: string, fullName: string, masterPasswordHash: string): Promise<Profile | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      full_name: fullName,
      master_password_hash: masterPasswordHash,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
}

export async function updateLastLogin(userId: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('user_profiles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error updating last login:', error);
  }
}
