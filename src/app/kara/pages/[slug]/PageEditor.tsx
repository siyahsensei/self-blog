'use client';

import { useState } from 'react';
import MarkdownView from '@/components/MarkdownView';
import { updatePage } from '../actions';
import { Page } from '@prisma/client';
import styles from '../../components/PostForm.module.css'; 
import ImageUploader from '@/components/ImageUploader';

interface PageEditorProps {
    page: Page;
}

export default function PageEditor({ page }: PageEditorProps) {
    const [content, setContent] = useState(page.content || '');

    const handleImageUpload = (url: string) => {
        const imageMarkdown = '\n![Image](' + url + ')\n';
        setContent(prev => prev + imageMarkdown);
    };

    const action = updatePage.bind(null, page.slug);

    return (
        <form action={action} className={styles.form}>
            {}
            <div className={styles.controls}>
                <div className={styles.field}>
                    <label>Title</label>
                    <input
                        name="title"
                        defaultValue={page.title}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label>Slug</label>
                    <input
                        disabled
                        value={page.slug}
                        className={`${styles.input} ${styles.disabled}`}
                    />
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
                    Update Page
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
                        placeholder="# Write content..."
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
