'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const tagsRaw = formData.get('tags') as string;
    const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
    const featuredImage = formData.get('featuredImage') as string;

    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    
    let finalSlug = slug;
    let count = 0;
    while (true) {
        const existing = await prisma.post.findUnique({ where: { slug: finalSlug } });
        if (!existing) break;
        count++;
        finalSlug = `${slug}-${count}`;
    }

    await prisma.post.create({
        data: {
            title,
            slug: finalSlug,
            content,
            tags,
            status,
            featuredImage: featuredImage || null,
        },
    });

    revalidatePath('/');
    revalidatePath('/kara');
    redirect('/kara');
}

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const tagsRaw = formData.get('tags') as string;
    const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
    const featuredImage = formData.get('featuredImage') as string;

    const tags = tagsRaw.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    
    let finalSlug = slug;
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
        
        let count = 1;
        while (true) {
            finalSlug = `${slug}-${count}`;
            const check = await prisma.post.findUnique({ where: { slug: finalSlug } });
            if (!check || check.id === id) break;
            count++;
        }
    }

    await prisma.post.update({
        where: { id },
        data: {
            title,
            slug: finalSlug,
            content,
            tags,
            status,
            featuredImage: featuredImage || null,
        },
    });

    revalidatePath('/');
    revalidatePath('/kara');
    revalidatePath(`/posts/${slug}`);
    redirect('/kara');
}

export async function deletePost(id: string) {
    await prisma.post.delete({
        where: { id },
    });
    revalidatePath('/');
    revalidatePath('/kara');
}
