
import { createSupabaseServerClient } from '@/lib/server/supabase';
import { UpdateCollectionSchema } from '@/lib/validations';
import { audit } from '@/lib/server/audit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .select('*, keys(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  }

  return NextResponse.json(collection);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, description } = await request.json();

  const { error: validationError } = UpdateCollectionSchema.safeParse({ name, description });
  if (validationError) {
    return NextResponse.json({ error: validationError.flatten() }, { status: 400 });
  }

  const { data: updatedCollection, error: updateError } = await supabase
    .from('collections')
    .update({ name, description })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await audit({ action: 'update_collection', success: true, duration: 0, user_id: user.id, resource_id: updatedCollection.id, resource_type: 'collection', ip_address: request.headers.get('x-forwarded-for'), user_agent: request.headers.get('user-agent'), metadata: {} });

  return NextResponse.json(updatedCollection);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await audit({ action: 'delete_collection', success: true, duration: 0, user_id: user.id, resource_id: params.id, resource_type: 'collection', ip_address: request.headers.get('x-forwarded-for'), user_agent: request.headers.get('user-agent'), metadata: {} });

  return NextResponse.json({ message: 'Collection deleted successfully' });
}
