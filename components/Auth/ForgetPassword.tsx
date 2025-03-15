'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Key } from 'lucide-react';
import { setAuthUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { toast } from 'sonner';

const ForgetPasswordPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState<string>('');
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('email===>', email);

        const forgetPassword = async () =>
            await axios.post(
                `${BASE_API_URL}/users/forget-password`,
                { email },
                { withCredentials: true }
            );

        const result = await handleAuthRequest(forgetPassword, setIsLoading);

        if (result) {
            toast.success(result.data.message);
            router.push(
                `/auth/reset-password?email=${encodeURIComponent(email)}`
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
                <div className="flex justify-center">
                    <Key className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-center">
                    Forget Your Password
                </h2>
                <p className="text-sm text-center text-gray-600">
                    Enter your email to reset your password
                </p>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm">
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={isLoading}
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 cursor-pointer"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPasswordPage;
