'use client';

import { BASE_API_URL } from '@/server';
import { RootState } from '@/store/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleAuthRequest } from '../utils/apiRequest';
import { addComment, likeOrDislike, setPost } from '@/store/postSlice';
import { Bookmark, Heart, Loader, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import DotButton from '../Auth/Helper/DotButton';
import Comment from '../Auth/Helper/Comment';
import { toast } from 'sonner';
import { setAuthUser } from '@/store/authSlice';
import ShareWith from '../Auth/Helper/ShareWith';

const Feed = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth?.user);
    const posts = useSelector((state: RootState) => state.posts?.posts);
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    // console.log('post====================', posts);

    useEffect(() => {
        const getAllPost = async () => {
            const getAllPostReq = async () =>
                await axios.get(`${BASE_API_URL}/posts/all`);
            const result = await handleAuthRequest(getAllPostReq, setIsLoading);
            if (
                result?.data?.data?.posts &&
                Array.isArray(result?.data?.data?.posts)
            ) {
                dispatch(setPost(result?.data?.data?.posts));
            } else {
                dispatch(setPost([])); // Default empty array
            }
        };
        getAllPost();
    }, [dispatch]);

    const handleLikeDislike = async (id: string) => {
        const result = await axios.post(
            `${BASE_API_URL}/posts/like-dislike/${id}`,
            {},
            { withCredentials: true }
        );

        if (result?.data?.status == 'success') {
            if (user?._id) {
                dispatch(likeOrDislike({ postId: id, userId: user._id }));
            } else {
                toast.error('User ID is not available');
            }
            toast.success(result?.data?.message);
        }
    };

    const handleSaveUnsave = async (postId: string) => {
        const result = await axios.post(
            `${BASE_API_URL}/posts/save-unsave-post/${postId}`,
            {},
            { withCredentials: true }
        );

        if (result?.data?.status == 'success') {
            dispatch(setAuthUser(result?.data?.data?.user));
            toast.success(result?.data?.message);
        }
    };

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
            setIsMessageOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <Loader size={36} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (posts.length < 1) {
        return (
            <section className="w-[80%] bg-white shadow-lg rounded-lg p-6 mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Feed</h2>
                <div className="bg-gray-100 p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-gray-700">
                        No Posts Found
                    </h3>
                    <p className="text-gray-500">
                        Create a new post to see updates.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <div className="w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6">
            {posts?.map(post => (
                <div
                    key={post._id}
                    className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src={post.user?.profilePicture}
                                    alt={post.user?.username}
                                />
                                <AvatarFallback className="bg-blue-500 text-white">
                                    {post.user?.username
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <h1 className="font-semibold text-gray-800">
                                {post?.user?.username}
                            </h1>
                        </div>

                        {/* three dot menu */}
                        <DotButton post={post} user={user} />
                    </div>

                    <div className="w-full rounded-md overflow-hidden">
                        <Image
                            src={post.image?.url || '/default-image.jpg'}
                            alt={post.caption}
                            width={500}
                            height={500}
                            className="w-full rounded-md object-cover"
                        />
                    </div>

                    <div className="flex items-center justify-between px-2 py-2">
                        <div className="flex space-x-4 text-gray-700">
                            <Heart
                                onClick={() => handleLikeDislike(post?._id)}
                                className={`cursor-pointer hover:text-red-500 ${
                                    user?._id &&
                                    Array.isArray(post.likes) &&
                                    post.likes.includes(user?._id)
                                        ? 'text-red-500'
                                        : ''
                                }`}
                            />

                            <MessageCircle
                                onClick={() => setIsMessageOpen(true)}
                                className="cursor-pointer hover:text-blue-500"
                            />

                            {/* shara with facebook, twitter, whatsapp, email, etc======== */}
                            {/* <Send
                                onClick={() => setIsShareDialogOpen(true)}
                                className="cursor-pointer hover:text-green-500"
                            /> */}

                            <ShareWith
                                postUrl={post?.image?.url}
                                postTitle={post?.user?.bio}
                                onClose={() => setIsShareDialogOpen(false)}
                            />
                        </div>
                        <Bookmark
                            onClick={() => handleSaveUnsave(post?._id)}
                            className={`cursor-pointer hover:text-yellow-500 ${
                                (user?.savedPosts as string[])?.some(
                                    (savePostId: string) =>
                                        savePostId === post?._id
                                )
                                    ? 'text-red-500 '
                                    : ''
                            }`}
                        />
                    </div>

                    <p className="text-gray-800 font-semibold">
                        {post?.likes?.length} likes
                    </p>
                    <p className="text-gray-700">{post?.caption}</p>

                    {/* comments */}
                    <Comment post={post} user={user} />

                    {/* Add Comment */}
                    {isMessageOpen && (
                        <div className="flex items-center border-t pt-3">
                            <input
                                type="text"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add a comment..."
                                value={text}
                                onChange={e => setText(e.target.value)}
                            />
                            <button
                                onClick={() => handleComment(post?._id)}
                                className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Post
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Feed;
