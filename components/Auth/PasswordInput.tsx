'use client';
import { Eye, EyeOff } from 'lucide-react';
import React, { ChangeEvent, useState } from 'react';

interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    inputClassName?: string;
    labelClassName?: string;
    iconClassName?: string;
}

const PasswordInput = ({
    name,
    label,
    placeholder = 'Enter Password',
    value,
    onChange,
    inputClassName = '',
    labelClassName = '',
    iconClassName = ''
}: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <>
            {label && (
                <label
                    className={`text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300 ${labelClassName}`}
                >
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={value}
                    name={name}
                    onChange={onChange}
                    className={`px-4 py-2 rounded-lg block w-full outline-none ${inputClassName}`}
                />
            </div>

            <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute outline-none top-1/2 right-4 transform p-0 -translate-y-1/2 ${iconClassName}`}
            >
                {showPassword ? <Eye size={5} /> : <EyeOff size={5} />}
            </button>
        </>
    );
};

export default PasswordInput;
