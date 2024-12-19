import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUser } from '@/lib/authFactory';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const checkAuth = async (router: AppRouterInstance) => {
    try {
        const user = await getUser();
        
        if (!user) {
            // No user detected
            toast.error('Please log in to access this page', {
                position: "top-right",
                autoClose: 1700,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // Redirect to login page after toast
            setTimeout(() => {
                router.push('/auth/login');
            }, 1200);
        }
    } catch (error) {
        // Handle any errors during user check
        toast.error('An error occurred. Please log in again.', {
            position: "top-right",
            autoClose: 1700,
        });
        router.push('/auth/login');
    }
};