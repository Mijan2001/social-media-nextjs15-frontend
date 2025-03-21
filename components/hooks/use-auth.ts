import { BASE_API_URL } from '@/server';
import { setAuthUser } from '@/store/authSlice';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { handleAuthRequest } from '../utils/apiRequest';

export const useFollowUnfollow = () => {
    const dispatch = useDispatch();
    const handleFollowUnfollow = async (userId: string) => {
        const followUnfollowReq = async () =>
            await axios.post(
                `${BASE_API_URL}/users/follow-unfollow/${userId}`,
                {},
                { withCredentials: true }
            );

        const result = await handleAuthRequest(followUnfollowReq);
        if (result?.data?.status == 'success') {
            dispatch(setAuthUser(result?.data?.data?.user));
            toast.success(result?.data?.message);
        }
    };

    return { handleFollowUnfollow };
};
