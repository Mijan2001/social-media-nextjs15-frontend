'use client';

import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ImageIcon, Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { addPost } from '@/store/postSlice';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const CreatePostModel = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [caption, setCaption] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setSelectedImage(null);
            setPreviewImage(null);
            setCaption('');
        }
    }, [isOpen]);

    const handleButtonClick = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate image file size
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should not exceed 10MB');
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setSelectedImage(file);

            // Convert file to data URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            setSelectedImage(file);
        }
    };

    const handleCreatePost = async () => {
        if (!selectedImage) {
            toast.error('Please select an image to create a post');
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', selectedImage);

        const createPostReq = async () =>
            await axios.post(`${BASE_API_URL}/posts/create-post`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

        const result = await handleAuthRequest(createPostReq, setLoading);

        if (result) {
            dispatch(addPost(result.data.data.post));
            toast.success('Post Created Successfully');
            setPreviewImage(null);
            setCaption('');
            setSelectedImage(null);
            onClose();
            router.push('/');
            router.refresh();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose}>
            <DialogContent className="p-6 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-center">
                        {previewImage ? 'Create Post' : 'Upload Photo'}
                    </DialogTitle>
                </DialogHeader>

                {previewImage ? (
                    <div className="flex flex-col gap-4">
                        <div className="w-full flex justify-center">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="rounded-lg w-full h-60 object-cover"
                            />
                        </div>

                        <input
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                        />

                        <div className="flex justify-between">
                            <Button
                                onClick={handleCreatePost}
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                            >
                                {loading ? (
                                    <Loader
                                        className="animate-spin mr-2"
                                        size={16}
                                    />
                                ) : null}
                                {loading ? 'Posting...' : 'Create Post'}
                            </Button>

                            <Button
                                onClick={() => {
                                    setPreviewImage(null);
                                    setSelectedImage(null);
                                    setCaption('');
                                    onClose();
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <ImageIcon size={80} className="text-gray-500" />
                        <p className="text-gray-600">Click to upload a photo</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button
                            onClick={handleButtonClick}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Select Photo
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostModel;
