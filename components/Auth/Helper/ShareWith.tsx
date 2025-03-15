'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Copy,
    Facebook,
    Mail,
    MessageCircle,
    Share2,
    Twitter,
    Send
} from 'lucide-react';

interface ShareButtonProps {
    postUrl: string;
    postTitle: string;
}

export default function ShareWith({ postUrl, postTitle }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    console.log('postUrl, postTitle :  ', postUrl, postTitle);

    // Function to copy link to clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(postUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            {/* Share Button */}
            <DialogTrigger asChild>
                <Share2 className="cursor-pointer hover:text-blue-500" />
            </DialogTrigger>

            {/* Dialog Content */}
            <DialogContent className="w-full max-w-md p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                    Share This Post
                </h2>

                <div className="flex flex-wrap gap-3 justify-center">
                    {/* Facebook Share */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            className="w-16 h-16 flex flex-col items-center justify-center"
                        >
                            <Facebook className="w-6 h-6 text-blue-600" />
                            <span className="text-xs mt-1">Facebook</span>
                        </Button>
                    </a>

                    {/* WhatsApp Share */}
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            postTitle + ' ' + postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            className="w-16 h-16 flex flex-col items-center justify-center"
                        >
                            <MessageCircle className="w-6 h-6 text-green-500" />
                            <span className="text-xs mt-1">WhatsApp</span>
                        </Button>
                    </a>

                    {/* Twitter (X) Share */}
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                            postTitle + ' ' + postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            className="w-16 h-16 flex flex-col items-center justify-center"
                        >
                            <Twitter className="w-6 h-6 text-blue-500" />
                            <span className="text-xs mt-1">Twitter</span>
                        </Button>
                    </a>

                    {/* Messenger Share */}
                    <a
                        href={`https://www.messenger.com/t/?link=${encodeURIComponent(
                            postUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            className="w-16 h-16 flex flex-col items-center justify-center"
                        >
                            <Send className="w-6 h-6 text-blue-700" />
                            <span className="text-xs mt-1">Messenger</span>
                        </Button>
                    </a>

                    {/* Email Share */}
                    <a
                        href={`mailto:?subject=${encodeURIComponent(
                            postTitle
                        )}&body=${encodeURIComponent(postUrl)}`}
                    >
                        <Button
                            variant="outline"
                            className="w-16 h-16 flex flex-col items-center justify-center"
                        >
                            <Mail className="w-6 h-6 text-gray-600" />
                            <span className="text-xs mt-1">Email</span>
                        </Button>
                    </a>

                    {/* Copy Link */}
                    <Button
                        variant="outline"
                        className="w-16 h-16 flex flex-col items-center justify-center"
                        onClick={handleCopyLink}
                    >
                        <Copy className="w-6 h-6 text-gray-500" />
                        <span className="text-xs mt-1">
                            {copied ? 'Copied!' : 'Copy Link'}
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
