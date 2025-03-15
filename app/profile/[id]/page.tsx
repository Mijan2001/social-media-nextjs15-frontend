import React from 'react';
import Profile from '@/components/Profile/Profile';

const ProfilePage = async ({ params }: { params: { id: string } }) => {
    const id = (await params).id || '';

    return (
        <div>
            <Profile id={id} />
        </div>
    );
};

export default ProfilePage;
