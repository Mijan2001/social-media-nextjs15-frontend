'use client';

import React, { useEffect, useState } from 'react';

import Feed from './Feed';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSiidebar';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger
} from '../ui/sheet';
import { Loader, MenuIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';
import { redirect } from 'next/navigation';

const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth?.user);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getAuthUser = async () => {
            const getAuthUserReq = async () =>
                await axios.get(`${BASE_API_URL}/users/me`, {
                    withCredentials: true
                });
            const result = await handleAuthRequest(
                getAuthUserReq,
                setIsLoading
            );
            if (result) dispatch(setAuthUser(result?.data?.data?.user));
        };
        getAuthUser();
    }, [dispatch]);

    useEffect(() => {
        if (!user) return redirect('/auth/login');
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <Loader size={36} className="animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex w-full space-x-2  min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <div>
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
                            <SheetDescription></SheetDescription>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content (Feed & Right Sidebar) */}

            {/* Feed Section */}
            <Feed />

            {/* Right Sidebar */}

            <RightSidebar />
        </div>
    );
};

export default Home;
