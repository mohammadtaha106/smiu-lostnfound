"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    onImageChange?: (file: File | null) => void;
}

export function ImageUpload({ onImageChange }: ImageUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            onImageChange?.(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const clearImage = () => {
        setPreview(null);
        onImageChange?.(null);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-smiu-navy">
                Upload Image (Optional)
            </label>

            {preview ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-lg overflow-hidden border-2 border-smiu-gold bg-secondary"
                >
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-2 rounded-full bg-smiu-burgundy text-white hover:bg-smiu-burgundy/90 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    animate={{
                        borderColor: isDragOver ? "#c5a059" : "#e2e8f0",
                        backgroundColor: isDragOver ? "rgba(197, 160, 89, 0.05)" : "transparent",
                    }}
                    className="relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-smiu-gold hover:bg-smiu-gold/5"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                            {isDragOver ? (
                                <Upload className="h-6 w-6 text-smiu-gold" />
                            ) : (
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-smiu-navy">
                                {isDragOver ? "Drop your image here" : "Drag and drop an image"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                or click to browse from your device
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
