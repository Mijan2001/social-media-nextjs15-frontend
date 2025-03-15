'use client';

import { BASE_API_URL } from '@/server';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, {
    ChangeEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { setAuthUser } from '@/store/authSlice';
import { toast } from 'sonner';
import { RootState } from '@/store/store';
import { Loader2 } from 'lucide-react';

const Verify = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state?.auth.user);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.replace('/auth/login');
        } else if (user?.isVerified) {
            router.replace('/');
        } else {
            setIsPageLoading(false);
        }
    }, [user, router]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            e.key === 'Backspace' &&
            !inputRefs.current[index]?.value &&
            inputRefs.current[index - 1]
        ) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const otpValue = otp.join('');
        const verifyReq = async () =>
            await axios.post(
                `${BASE_API_URL}/users/verify`,
                { otp: otpValue },
                { withCredentials: true }
            );

        const result = await handleAuthRequest(verifyReq, setIsLoading);

        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
            router.push('/auth/login');
        }
    };

    const handleResendOtp = async () => {
        const resendOtpReq = async () =>
            await axios.post(`${BASE_API_URL}/users/resend-otp`, null, {
                withCredentials: true
            });

        const result = await handleAuthRequest(resendOtpReq, setIsLoading);

        if (result) {
            toast.success(result.data.message);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-20 h-20 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
                <p className="text-gray-600 mb-6">
                    A code has been sent to {user?.email}
                </p>

                <div className="flex justify-center space-x-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={el => (inputRefs.current[index] = el)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onChange={e => handleChange(e, index)}
                            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                        />
                    ))}
                </div>

                <button
                    onClick={handleResendOtp}
                    className="mb-4 w-full text-sm text-blue-500 hover:underline"
                >
                    Didn't get the code?{' '}
                    <span className="font-medium">Resend OTP</span>
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-2 cursor-pointer rounded-lg text-white font-semibold flex items-center justify-center transition ${
                        isLoading
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin  mr-2" />
                    ) : (
                        'Confirm OTP'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Verify;
