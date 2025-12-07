'use client';

import { useState, useRef } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
    label?: string;
    defaultImage?: string;
    onUpload: (url: string) => void;
    className?: string;
}

export default function ImageUploader({ label = 'Upload Image', defaultImage, onUpload, className }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setIsUploading(true);

        
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onUpload(data.url);
            setPreview(data.url); 
        } catch (error) {
            console.error(error);
            alert('Failed to upload image');
            setPreview(defaultImage || null); 
        } finally {
            setIsUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={styles.dropzone}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <div className={styles.previewContainer}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Preview" className={styles.image} />
                        <div className={styles.overlay}>
                            <span>{isUploading ? 'Uploading...' : 'Click to Change'}</span>
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <span>{isUploading ? 'Uploading...' : 'Click or Drag Image Here'}</span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.input}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
