import { User } from '@/types';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {
    userProfile: User | undefined;
};

const Post = ({ userProfile }: Props) => {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {userProfile?.posts.map(post => (
                <div
                    key={post?._id}
                    className="relative group overflow-hidden rounded-lg"
                >
                    <Image
                        src={post?.image?.url || '/default-image.jpg'}
                        alt="Post"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-60 transition-opacity">
                        <div className="flex items-center gap-1 text-white">
                            <Heart className="w-6 h-6" />
                            <span>{post?.likes.length}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                            <MessageCircle className="w-6 h-6" />
                            <span>{post?.comments.length}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Post;
