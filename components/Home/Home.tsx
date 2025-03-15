import React from 'react';

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
import { MenuIcon } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex w-full space-x-2  min-h-screen bg-gray-100">
            {/* Left Sidebar */}

            <LeftSidebar />

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
