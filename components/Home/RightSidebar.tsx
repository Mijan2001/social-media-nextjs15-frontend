'use client';

import { BASE_API_URL } from '@/server';
import { RootState } from '@/store/store';
import { User } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { handleAuthRequest } from '../utils/apiRequest';
import { Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const RightSidebar = () => {
    const user = useSelector((state: RootState) => state?.auth.user);
    const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    console.log('Suggestions: ', suggestedUser);

    useEffect(() => {
        const getSuggestedUser = async () => {
            const getSuggestedUserReq = async () =>
                await axios.get(`${BASE_API_URL}/users/suggested-user`, {
                    withCredentials: true
                });

            const result = await handleAuthRequest(
                getSuggestedUserReq,
                setIsLoading
            );

            if (result) {
                setSuggestedUser(result.data.data.users);
            }
        };

        if (user) {
            getSuggestedUser();
        }
    }, []);

    // spin loader======

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full flex-col">
                <Loader className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="hidden md:w-[30%] md:block bg-white shadow-md rounded-lg p-2 ">
            <div className="flex justify-between space-x-4">
                <div className="flex justify-center items-center space-x-2">
                    <Avatar className="w-9 h-9">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="bg-blue-400/25 cursor-pointer hover:bg-blue-400/50">
                            {user?.username.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-sm font-semibold">
                            {user?.username}
                        </h1>
                        <p className="text-gray-700 text-sm">
                            {user?.bio || 'My Profile'}
                        </p>
                    </div>
                </div>
                <h1 className="font-sm cursor-pointer text-blue-400 hover:text-blue-600">
                    Switch
                </h1>
            </div>

            <div className="flex justify-between items-center mt-4">
                <h1>Suggested for you</h1>
                <h3>See all</h3>
            </div>

            {suggestedUser?.slice(0, 5).map(s_user => {
                return (
                    <div
                        key={s_user._id}
                        onClick={() => router.push(`/profile/${s_user._id}`)}
                        className="flex cursor-pointer hover:bg-gray-200 p-2 justify-between mt-4 items-center space-x-2"
                    >
                        <div className="flex justify-center items-center space-x-2">
                            <Avatar className="w-9 h-9">
                                <AvatarImage src={s_user?.profilePicture} />
                                <AvatarFallback className="bg-blue-400/25  hover:bg-blue-400/50">
                                    {s_user?.username.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-sm font-semibold">
                                    {s_user?.username}
                                </h1>
                                <p className="text-gray-700 text-sm">
                                    {s_user?.bio || 'My Profile'}
                                </p>
                            </div>
                        </div>
                        <h1 className="font-sm text-blue-400 hover:text-blue-600">
                            Details
                        </h1>
                    </div>
                );
            })}
        </div>
    );
};

export default RightSidebar;
