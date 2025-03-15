'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setAuthUser } from '@/store/authSlice';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const dispatch = useDispatch();
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleResetPassword = async () => {
        if (!otp || !password || !passwordConfirm) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password !== passwordConfirm) {
            toast.error('Passwords do not match');
            return;
        }

        const data = { email, otp, password, passwordConfirm };

        const resetPassReq = async () =>
            await axios.post(`${BASE_API_URL}/users/reset-password`, data, {
                withCredentials: true
            });

        const result = await handleAuthRequest(resetPassReq, setIsLoading);

        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
            router.push('/auth/login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                    Reset Your Password
                </h1>
                <p className="text-gray-500 text-center mb-6">
                    Enter your OTP and new password below.
                </p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        className="w-full p-3 ring ring-gray-300  rounded-lg focus:ring-[1px] focus:ring-blue-500/60 focus:border-blue-500/60 focus:outline-none focus:border-none"
                    />
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 ring ring-gray-300  rounded-lg focus:ring-[1px] focus:ring-blue-500/60 focus:border-blue-500/60 focus:outline-none focus:border-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        className="w-full p-3 ring ring-gray-300 rounded-lg focus:ring-[1px] focus:ring-blue-500/60 focus:border-blue-500/60 focus:outline-none focus:border-none"
                    />
                </div>

                <div className="flex flex-col space-y-3 mt-6">
                    <button
                        onClick={handleResetPassword}
                        disabled={isLoading} // Disable button when loading
                        className={`flex cursor-pointer justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                    <button
                        onClick={() => router.push('/auth/forget-password')}
                        disabled={isLoading} // Disable Go Back button when loading
                        className={`bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
