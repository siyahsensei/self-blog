'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePage(slug: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    await prisma.page.update({
        where: { slug },
        data: {
            title,
            content,
        },
    });

    revalidatePath(`/${slug}`);
    revalidatePath(`/kara/pages/${slug}`);
    redirect(`/kara/pages/${slug}`); 
}
