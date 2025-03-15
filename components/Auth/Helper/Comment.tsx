'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Post, User } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DotButton from './DotButton';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { addComment } from '@/store/postSlice';
import { toast } from 'sonner';

type Props = {
    post: Post;
    user: User | null;
};

const Comment = ({ post, user }: Props) => {
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleComment = async (id: string) => {
        if (!text) return;
        const addCommentReq = async () =>
            await axios.post(
                `${BASE_API_URL}/posts/comment/${id}`,
                { text },
                { withCredentials: true }
            );
        const result = await handleAuthRequest(addCommentReq, setIsLoading);

        if (result?.data?.status == 'success') {
            dispatch(
                addComment({
                    postId: id,
                    comment: result?.data?.data?.comment
                })
            );

            toast.success(result?.data?.message);
            setText('');
        }
    };

    return (
        <>
            {/* Comment Modal Trigger */}
            <Dialog>
                <DialogTrigger asChild>
                    <button className="text-sm text-blue-600 hover:underline">
                        View All {post?.comments?.length} Comments
                    </button>
                </DialogTrigger>

                <DialogContent className="w-full max-w-2xl rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Comments
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-between md:flex-row items-start gap-4">
                        {/* Post Image (Left) */}
                        <div className="w-full md:w-1/2">
                            <Image
                                alt="Post Image"
                                src={
                                    post?.image?.url ||
                                    '/images/placeholder.png'
                                }
                                width={300}
                                height={300}
                                className="rounded-lg object-cover shadow-md"
                            />
                        </div>

                        {/* Comments Section (Right) */}
                        <div className="w-full md:w-1/2 flex flex-col gap-4">
                            {/* User Info */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage
                                            src={post?.user?.profilePicture}
                                            alt="User"
                                        />
                                        <AvatarFallback>
                                            {post?.user?.username
                                                ?.slice(0, 1)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {post?.user?.username}
                                    </p>
                                </div>
                                <DotButton post={post} user={user} />
                            </div>

                            {/* Scrollable Comments List */}
                            <div className="max-h-56 overflow-y-auto space-y-3 px-2">
                                {post?.comments?.map(item => (
                                    <div
                                        key={item._id}
                                        className="flex items-start gap-3 hover:bg-gray-100 p-1"
                                    >
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={item?.user?.profilePicture}
                                                alt="User"
                                            />
                                            <AvatarFallback>
                                                {item?.user?.username
                                                    ?.slice(0, 1)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-xs font-semibold text-gray-900">
                                                {item?.user?.username}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item?.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 p-4">
                        <Input
                            type="text"
                            value={text}
                            placeholder="Add a comment..."
                            className="flex-grow outline-none shadow-0 focus:outline-none focus:ring-1 ring-blue-500"
                            onChange={e => setText(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={() => handleComment(post?._id)}
                        >
                            Send
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Comment;
