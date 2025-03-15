'use client';
import { BASE_API_URL } from '@/server';
import { RootState } from '@/store/store';
import { User } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleAuthRequest } from '../utils/apiRequest';
import { Bookmark, Grid, Loader, MenuIcon } from 'lucide-react';
import LeftSidebar from '../Home/LeftSiidebar';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from '../ui/sheet';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import Post from './Post';
import Save from './Save';
import { useFollowUnfollow } from '../hooks/use-auth';

type Props = {
    id: string;
};

const ProfilePage = ({ id }: Props) => {
    const { handleFollowUnfollow } = useFollowUnfollow();
    const router = useRouter();
    const user = useSelector((state: RootState) => state?.auth.user);
    const [portOrSave, setPortOrSave] = useState<string>('PORT');
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState<User>();
    const isOwnProfile = user?._id === id;
    const isFollowing = user?.following.includes(id);

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
            return;
        }
        const getUser = async () => {
            const getUserReq = async () =>
                await axios.get(`${BASE_API_URL}/users/profile/${id}`);

            const result = await handleAuthRequest(getUserReq, setIsLoading);
            if (result) {
                setUserProfile(result?.data?.data?.user);
            }
        };
        getUser();
    }, [user, router, id]);

    // loading spinner=========
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader className="animate-spin" size={36} />
            </div>
        );
    }

    return (
        <div className="flex mb-20">
            <div className="hidden] md:block">
                <LeftSidebar />
            </div>

            <div className="flex-1 p-2 font-bold md:ml-[20%] overflow-y-auto fixed">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger>
                            <MenuIcon />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetTitle>Menu</SheetTitle>
                            <SheetDescription>
                                <LeftSidebar />
                            </SheetDescription>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="w-[90%] sm:w-[80%] mx-auto">
                {/* TOP PROFILE=======  */}
                <div className="mt-16 ml-20 flex md:flex-row flex-col md:items-center pb-16 border-b-2 md:space-x-20">
                    <Avatar className="w-[10rem] h-[10rem]">
                        <AvatarImage
                            src={userProfile?.profilePicture}
                            className="w-full h-full rounded-full"
                        />
                        <AvatarFallback>
                            {userProfile?.username.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold">
                                {userProfile?.username}
                            </h1>
                            {isOwnProfile && (
                                <Link href="/auth/edit-profile">
                                    <Button>Edit Profile</Button>
                                </Link>
                            )}
                            {!isOwnProfile && (
                                <Button
                                    className="cursor-pointer hover:bg-gray-200 hover:text-gray-800"
                                    onClick={() => handleFollowUnfollow(id)}
                                    variant={
                                        isFollowing
                                            ? 'destructive'
                                            : 'secondary'
                                    }
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center space-x-8 mt-6 mb-6">
                            <div className="font-bold">
                                <span>{userProfile?.posts?.length}</span>
                                <span> posts</span>
                            </div>
                            <div className="font-bold">
                                <span>{userProfile?.followers?.length}</span>
                                <span> followers</span>
                            </div>
                            <div className="font-bold">
                                <span>{userProfile?.following?.length}</span>
                                <span> following</span>
                            </div>
                        </div>
                        <p className="w-[80%] font-medium">
                            {userProfile?.bio || 'My Profile Bio Here'}
                        </p>
                    </div>
                </div>

                {/* POSTS======= */}
                <div className="mt-10">
                    <div className="flex items-center justify-center space-x-14">
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${
                                portOrSave === 'POST'
                                    ? 'text-blue-500'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setPortOrSave('POST')}
                        >
                            <Grid />
                            <span className="font-semibold">POST</span>
                        </div>
                        <div
                            className={`flex items-center space-x-2 cursor-pointer ${
                                portOrSave === 'SAVE'
                                    ? 'text-blue-500'
                                    : 'text-gray-500'
                            }`}
                            onClick={() => setPortOrSave('SAVE')}
                        >
                            <Bookmark />
                            <span className="font-semibold">SAVE</span>
                        </div>
                    </div>

                    {portOrSave === 'POST' && (
                        <Post userProfile={userProfile} />
                    )}
                    {portOrSave === 'SAVE' && (
                        <Save userProfile={userProfile} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
