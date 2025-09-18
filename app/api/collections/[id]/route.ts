
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { UpdateCollectionSchema } from '@/lib/validations';
import { auditEncryption } from '@/lib/server/audit';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .select('*, keys(*)')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json(collection);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, color, icon } = await request.json();

  const { error: validationError } = UpdateCollectionSchema.safeParse({ name, description, color, icon });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { data: updatedCollection, error: updateError } = await supabase
    .from('collections')
    .update({ name, description, color, icon })
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await auditEncryption({ action: 'update_collection', success: true, duration: 0, user_id: session.user.id, resource_id: updatedCollection.id });

  return NextResponse.json(updatedCollection);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', params.id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await auditEncryption({ action: 'delete_collection', success: true, duration: 0, user_id: session.user.id, resource_id: params.id });

  return NextResponse.json({ message: 'Collection deleted successfully' });
}
