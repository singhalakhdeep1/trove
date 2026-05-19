'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploadProps {
    onUpload: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // in bytes
    accept?: Record<string, string[]>;
    preview?: boolean;
    className?: string;
}

export default function ImageUpload({
    onUpload,
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    preview = true,
    className = '',
}: ImageUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError('');

            if (rejectedFiles.length > 0) {
                const errors = rejectedFiles.map((f) => f.errors[0]?.message).join(', ');
                setError(errors);
                return;
            }

            if (files.length + acceptedFiles.length > maxFiles) {
                setError(`Maximum ${maxFiles} files allowed`);
                return;
            }

            // Validate file sizes
            const oversized = acceptedFiles.filter((file) => file.size > maxSize);
            if (oversized.length > 0) {
                setError(`Files must be less than ${maxSize / 1024 / 1024}MB`);
                return;
            }

            // Create previews
            const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
            setFiles((prev) => [...prev, ...acceptedFiles]);

            onUpload([...files, ...acceptedFiles]);
        },
        [files, maxFiles, maxSize, onUpload]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
        multiple: maxFiles > 1,
    });

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);

        setFiles(newFiles);
        setPreviews(newPreviews);
        onUpload(newFiles);
    };

    const uploadToCloud = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            console.log('Upload successful:', data);

            // Clear files after successful upload
            setFiles([]);
            setPreviews([]);
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
            >
                <input {...getInputProps()} />
                <div className="space-y-2">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="text-sm text-gray-600">
                        {isDragActive ? (
                            <p className="font-medium text-blue-600">Drop files here...</p>
                        ) : (
                            <>
                                <p>
                                    <span className="font-medium text-blue-600 hover:text-blue-500">
                                        Click to upload
                                    </span>{' '}
                                    or drag and drop
                                </p>
                                <p className="text-xs">
                                    PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB (max {maxFiles} files)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Preview Grid */}
            {preview && previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                                <Image
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <p className="text-xs text-gray-500 mt-1 truncate">{files[index].name}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
                <button
                    onClick={uploadToCloud}
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
                </button>
            )}
        </div>
    );
}
