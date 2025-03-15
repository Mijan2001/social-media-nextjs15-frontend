import React from 'react';

const Feed = () => {
    return (
        <section className="w-[80%] bg-white shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Feed</h2>
            <div className="space-y-4">
                {/* Example Post */}
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">User Name</h3>
                    <p className="text-gray-600">
                        This is a sample post content.
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <h3 className="font-semibold">Another User</h3>
                    <p className="text-gray-600">Another post example.</p>
                </div>
            </div>
        </section>
    );
};

export default Feed;
