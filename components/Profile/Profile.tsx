import React from 'react';

type Props = {
    id: string;
};

const ProfilePage = ({ id }: Props) => {
    console.log('profile id: ', id);
    return <div>ProfilePage</div>;
};

export default ProfilePage;
