'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageCropperProps {
    src: string;
    aspectRatio?: number; // e.g., 16/9, 1 (square), 4/3
    onCrop: (croppedImage: Blob) => void;
    onCancel: () => void;
}

export default function ImageCropper({
    src,
    aspectRatio = 1,
    onCrop,
    onCancel,
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
    const [zoom, setZoom] = useState(1);

    const handleCrop = async () => {
        try {
            // Create canvas for cropping
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const image = new window.Image();
            image.src = src;

            await new Promise((resolve) => {
                image.onload = resolve;
            });

            canvas.width = crop.width * zoom;
            canvas.height = crop.height * zoom;

            ctx.drawImage(
                image,
                crop.x * zoom,
                crop.y * zoom,
                crop.width * zoom,
                crop.height * zoom,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    onCrop(blob);
                }
            }, 'image/jpeg', 0.95);
        } catch (error) {
            console.error('Crop error:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Crop Image</h3>

                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image
                        src={src}
                        alt="Crop preview"
                        fill
                        className="object-contain"
                        style={{ transform: `scale(${zoom})` }}
                    />
                    <div
                        className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
                        style={{
                            left: `${crop.x}px`,
                            top: `${crop.y}px`,
                            width: `${crop.width}px`,
                            height: `${crop.height}px`,
                        }}
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zoom: {zoom.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCrop}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Crop & Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
