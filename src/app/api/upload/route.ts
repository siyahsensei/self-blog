import { NextRequest, NextResponse } from 'next/server';
import minioClient, { BUCKET_NAME, ensureBucketExists } from '@/lib/minio';
import crypto from 'crypto';
import { extname } from 'path';


export async function POST(request: NextRequest) {
    try {
        await ensureBucketExists();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = extname(file.name);
        const filename = `${new Date().toISOString().split('T')[0]}-${crypto.randomUUID()}${ext}`;

        const metaData = {
            'Content-Type': file.type,
        };

        await minioClient.putObject(BUCKET_NAME, filename, buffer, buffer.length, metaData);

        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
        const portStr = process.env.MINIO_PORT;

        let port = '';
        if (portStr) {
            const p = parseInt(portStr);
            if ((protocol === 'https' && p !== 443) || (protocol === 'http' && p !== 80)) {
                port = `:${p}`;
            }
        }

        
        const url = `${protocol}://${endpoint}${port}/${BUCKET_NAME}/${filename}`;

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
