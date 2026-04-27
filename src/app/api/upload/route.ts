import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const form = await request.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
  }

  try {
    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('Blob upload error:', err);
    return NextResponse.json({ error: 'Error al subir la imagen.' }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { url } = await request.json() as { url?: string };

  if (!url || !url.includes('.blob.vercel-storage.com')) {
    return NextResponse.json({ ok: true }); // not a Blob URL — nothing to do
  }

  await del(url);
  return NextResponse.json({ ok: true });
}
