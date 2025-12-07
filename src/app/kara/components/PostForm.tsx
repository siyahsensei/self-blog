
'use client';

import { useState, useRef } from 'react';
import MarkdownView from '@/components/MarkdownView';
import { createPost, updatePost } from '../actions';
import { Post } from '@prisma/client';
import styles from './PostForm.module.css';
import ImageUploader from '@/components/ImageUploader';

interface PostFormProps {
    post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [content, setContent] = useState(post?.content || '');
    const [isDirty, setIsDirty] = useState(false);

    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!post && !isDirty) {
            setSlug(newTitle.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, ''));
        }
    };

    const action = post ? updatePost.bind(null, post.id) : createPost;

    const handleImageUpload = (url: string) => {
        
        const imageMarkdown = '\n![Image](' + url + ')\n';
        setContent(prev => prev + imageMarkdown);
    };

    return (
        <form action={action} className={styles.form}>
            {}
            <div className={styles.controls}>
                <div className={styles.field}>
                    <label>Featured Image</label>
                    <ImageUploader
                        defaultImage={post?.featuredImage || undefined}
                        onUpload={(url) => {
                            
                            
                            const input = document.getElementById('featuredImageInput') as HTMLInputElement;
                            if (input) input.value = url;
                        }}
                    />
                    <input type="hidden" name="featuredImage" id="featuredImageInput" defaultValue={post?.featuredImage || ''} />
                </div>

                <div className={styles.field}>
                    <label>Title</label>
                    <input
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                        className={styles.input}
                        placeholder="Post Title"
                    />
                </div>

                <div className={styles.field}>
                    <label>Slug</label>
                    <input
                        name="slug"
                        value={slug}
                        onChange={(e) => {
                            setSlug(e.target.value);
                            setIsDirty(true);
                        }}
                        required
                        className={styles.input}
                        placeholder="post-slug"
                    />
                </div>

                <div className={styles.field}>
                    <label>Tags</label>
                    <input
                        name="tags"
                        defaultValue={post?.tags.join(', ')}
                        className={styles.input}
                        placeholder="linux, tech, nextjs"
                    />
                </div>

                <div className={styles.field}>
                    <label>Status</label>
                    <select name="status" defaultValue={post?.status || 'DRAFT'} className={styles.select}>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Insert Content Image</label>
                    <ImageUploader
                        label=""
                        onUpload={handleImageUpload}
                        className={styles.miniUploader}
                    />
                </div>

                <button type="submit" className={styles.saveBtn}>
                    {post ? 'Update Post' : 'Publish Post'}
                </button>
            </div>

            {}
            <div className={styles.editorContainer}>
                <div className={styles.editorPane}>
                    <div className={styles.paneHeader}>Markdown Input</div>
                    <textarea
                        name="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.textarea}
                        required
                        placeholder="# Write something amazing..."
                    />
                </div>
                <div className={styles.previewPane}>
                    <div className={styles.paneHeader}>Live Preview</div>
                    <div className={styles.preview}>
                        <MarkdownView content={content} />
                    </div>
                </div>
            </div>
        </form>
    );
}
