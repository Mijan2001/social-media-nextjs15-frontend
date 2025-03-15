'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import PasswordInput from '@/components/Auth/PasswordInput';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/store/authSlice';

interface FormData {
    email: string;
    password: string;
}

interface Errors {
    email?: string;
    password?: string;
}

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<Errors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let newErrors: Errors = {};

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';

        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedFormData = { ...prev, [name]: value };
            return updatedFormData;
        });

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // setIsLoading(true);

        const loginReq = async () =>
            await axios.post(`${BASE_API_URL}/users/login`, formData, {
                withCredentials: true
            });

        const result = await handleAuthRequest(loginReq, setIsLoading);

        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            console.log(result.data.data.user);
            toast.success('Login successful. Redirecting to Home page');
            router.push('/');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-950">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
                    Login With Social App
                </h2>

                {/* Banner  */}
                <div className="flex items-center justify-center mt-4">
                    <img
                        src="/banner-login.jpg"
                        alt="Social App"
                        className="w-36 h-36 rounded-md"
                    />
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full p-2 mt-1 text-gray-900 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            label="Password"
                            placeholder="Enter your password"
                            inputClassName="w-full text-gray-900 border rounded-md dark:text-white dark:bg-gray-700 dark:border-gray-600 focus:ring focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}

                        {/* Forgot Password */}
                        <Link
                            href="/auth/forget-password"
                            className="block text-end mt-2 text-sm text-blue-500 hover:underline cursor-pointer"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Login Button with Spinner */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md flex justify-center items-center hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Already have an account? */}
                <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        href="/auth/signup"
                        className="text-blue-500 hover:underline cursor-pointer"
                    >
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}
