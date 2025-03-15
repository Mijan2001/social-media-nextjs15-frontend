'use client';
interface Props {
    post: Post;
    user: User | null;
}

import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Post, User } from '@/types';
import Link from 'next/link';
import { useFollowUnfollow } from '@/components/hooks/use-auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { deletePost } from '@/store/postSlice';
import { toast } from 'sonner';

const DotButton = ({ post, user }: Props) => {
    const [open, setOpen] = useState(false);
    const { handleFollowUnfollow } = useFollowUnfollow();
    const dispatch = useDispatch();

    const isOwnPost = post?.user?._id === user?._id;
    const isFollowing = post?.user?._id
        ? user?.following.includes(post?.user?._id)
        : false;

    const handleDeletePost = async () => {
        const deletePostReq = async () =>
            await axios.delete(
                `${BASE_API_URL}/posts/delete-post/${post?._id}`,
                {
                    withCredentials: true
                }
            );
        const result = await handleAuthRequest(deletePostReq);
        if (result?.data?.status == 'success') {
            dispatch(deletePost(post?._id));
            toast.success(result?.data?.message);
        }
    };

    return (
        <div className="relative">
            {/* Dropdown Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                        <BsThreeDots className="w-6 h-6 text-gray-600" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className=" max-w-md">
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Button
                            onClick={() => {
                                if (post?.user?._id) {
                                    handleFollowUnfollow(post?.user?._id);
                                }
                            }}
                            variant={isFollowing ? 'destructive' : 'secondary'}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Link href={`/profile/${post?.user?._id}`}>
                            <Button variant={'secondary'}>
                                About This Account
                            </Button>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Button variant={'secondary'}>Cancel</Button>
                    </DropdownMenuItem>
                    {isOwnPost && (
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Button
                                variant="destructive"
                                onClick={handleDeletePost}
                            >
                                Delete Post
                            </Button>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DotButton;
