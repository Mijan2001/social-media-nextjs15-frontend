'use client';

import Link from 'next/link';
import {
    FaHome,
    FaSearch,
    FaEnvelope,
    FaBell,
    FaPlus,
    FaUser,
    FaSignOutAlt
} from 'react-icons/fa';
import { useState } from 'react';
import { IoMdMenu, IoMdClose } from 'react-icons/io';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';

const LeftSidebar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        await axios.post(`${BASE_API_URL}/users/logout`, null, {
            withCredentials: true
        });

        dispatch(setAuthUser(null));
        toast.success('Logged out successfully');
        router.push('/auth/login');
    };

    const handleSidebar = (label: string) => {
        if (label === 'Logout') {
            handleLogout();
        } else if (label === 'Home') {
            router.push('/');
        } else if (label === 'Profile') {
            router.push(`/profile/${user?._id}`);
        }
    };

    const user = useSelector((state: RootState) => state.auth.user);
    console.log('use : ', user?.username.slice(0, 1).toUpperCase());

    const sidebarLinks = [
        { label: 'Home', icon: <FaHome />, link: '/' },
        { label: 'Search', icon: <FaSearch />, link: '/search' },
        { label: 'Messages', icon: <FaEnvelope />, link: '/messages' },
        { label: 'Notifications', icon: <FaBell />, link: '/notifications' },
        {
            label: 'Create',
            icon: <FaPlus />,
            link: '/create'
        },
        {
            label: 'Profile',
            icon: (
                <Avatar className="w-9 rounded-full h-9">
                    <AvatarImage
                        src={user?.profilePicture}
                        alt="Create"
                        className="w-full h-full"
                    />
                    <AvatarFallback>
                        {user?.username.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            ),
            link: '/profile'
        },
        { label: 'Logout', icon: <FaSignOutAlt />, link: '/logout' }
    ];

    return (
        <aside className="w-[20%] bg-white shadow-lg md:block hidden  h-screen p-6">
            {/* Sidebar Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <button
                    className="lg:hidden text-gray-800"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
                </button>
            </div>

            {/* Sidebar Links */}
            <ul className="space-y-4">
                {sidebarLinks.map((link, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleSidebar(link.label)}
                            className={`flex items-center space-x-4 px-4 py-1 rounded-lg transition-all cursor-pointer 
                    ${
                        pathname === link.link
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'
                    }`}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className="font-medium">{link.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default LeftSidebar;
