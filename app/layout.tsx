import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from 'sonner'; // Import Sonner
import ClientProvider from '@/HOC/ClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Social Media App',
    description: 'A social media application built with Next.js and Express',
    generator: 'v0.dev'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ClientProvider>
                    {/* <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    > */}
                    <div className="min-h-screen flex flex-col">
                        <div className="flex-1">{children}</div>
                    </div>
                    <Toaster />
                    {/* </ThemeProvider> */}
                </ClientProvider>
            </body>
        </html>
    );
}
