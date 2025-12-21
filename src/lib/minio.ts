import * as Minio from 'minio';

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'blog-images';

export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: unknown) {
            lastError = error as Error;
            const errorCode = (error as { code?: string })?.code;

            if (errorCode === 'EAI_AGAIN' || errorCode === 'ENOTFOUND' || errorCode === 'ETIMEDOUT') {
                const delay = baseDelayMs * Math.pow(2, attempt);
                console.warn(`MinIO operation failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`, errorCode);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }

    throw lastError;
}

export async function ensureBucketExists() {
    try {
        const exists = await withRetry(() => minioClient.bucketExists(BUCKET_NAME));
        if (!exists) {
            await withRetry(() => minioClient.makeBucket(BUCKET_NAME, 'us-east-1'));
            console.log(`Bucket ${BUCKET_NAME} created successfully.`);


            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Sid: 'PublicReadGetObject',
                        Effect: 'Allow',
                        Principal: '*',
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
                    },
                ],
            };
            await withRetry(() => minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy)));
            console.log(`Bucket policy set to public read for ${BUCKET_NAME}.`);
        }
    } catch (err) {
        console.error('Error ensuring bucket exists:', err);
    }
}

export default minioClient;

