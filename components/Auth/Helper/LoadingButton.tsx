import { Button, ButtonProps } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import React from 'react';

interface Props extends ButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
}

const LoadingButton: React.FC<Props> = ({ isLoading, children, ...props }) => {
    return (
        <Button disabled={isLoading} {...props}>
            {isLoading ? <Loader className="animate-spin mr-2" /> : null}
            {children}
        </Button>
    );
};

export default LoadingButton;
