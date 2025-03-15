'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LeftSidebar from '@/components/Home/LeftSiidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { toast } from 'sonner';
import { setAuthUser } from '@/store/authSlice';

const EditProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state?.auth.user);
    const [selectedImage, setSelectedImage] = useState<string | null>(
        user?.profilePicture || null
    );
    const [bio, setBio] = useState('');

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        if (!fileInputRef.current?.files?.[0]) {
            toast.error('Please select an image');
            return;
        }
        console.log('bioData =>', bio);
        const formData = new FormData();
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            formData.append('profilePicture', file);
        }

        console.log('formData =>', formData);

        const updateProfileReq = async () =>
            await axios.post(
                `${BASE_API_URL}/users/edit-profile`,
                { formData, bio },
                {
                    withCredentials: true
                }
            );
        const result = await handleAuthRequest(updateProfileReq, setLoading);
        console.log('result ==> ', result);
        if (result) {
            dispatch(setAuthUser(result?.data?.data?.user));
            toast.success(result.data.message);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            toast.error('All fields are required!');
            return;
        }
        if (newPassword !== newPasswordConfirm) {
            toast.error('Passwords do not match!');
            return;
        }

        const data = { currentPassword, newPassword, newPasswordConfirm };
        const updatePassReq = async () =>
            await axios.post(`${BASE_API_URL}/users/change-password`, data, {
                withCredentials: true
            });

        const result = await handleAuthRequest(updatePassReq, setLoading);
        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
    };

    // Handle profile image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="flex flex-row w-full items-center justify-center min-h-screen bg-gray-100 ">
                {/* left sidebar =========  */}
                <div className="hidden h-full md:block mr-2 w-[20%]">
                    <LeftSidebar />
                </div>

                {/* Profile Section */}
                <div className="bg-white  p-6 w-full">
                    <div className="flex flex-col items-center">
                        <div onClick={handleAvatarClick} className="relative">
                            <Avatar className="w-[150] h-[150]">
                                <AvatarImage
                                    src={
                                        selectedImage || '/default-profile.png'
                                    }
                                    className="rounded-full border-2 border-gray-300"
                                />
                                <AvatarFallback>
                                    {user?.username.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                placeholder="Change Profile Picture"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button
                            onClick={handleUpdateProfile}
                            className="mt-2 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            {loading ? (
                                <Loader className="animate-spin w-5 h-5" />
                            ) : (
                                'Change Photo'
                            )}
                        </button>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Biography
                        </label>
                        <textarea
                            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={3}
                            placeholder="Tell us about yourself..."
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        />
                        <button
                            onClick={handleUpdateProfile}
                            className="w-full mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Change Bio
                        </button>
                    </div>

                    {/* Change Password Section */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            Change Password
                        </h2>
                        <form onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={currentPassword}
                                onChange={e =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={newPasswordConfirm}
                                onChange={e =>
                                    setNewPasswordConfirm(e.target.value)
                                }
                            />
                            <button
                                type="submit"
                                className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader className="animate-spin w-5 h-5" />
                                ) : (
                                    'Change Password'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;
