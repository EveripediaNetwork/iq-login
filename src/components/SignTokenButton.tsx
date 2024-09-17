import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useAuth } from '../lib/hooks/useAuth';

interface SignTokenButtonProps {
  handleRedirect: () => void;
  handleTokenPass?: (token: string) => Promise<void>;
}

export const SignTokenButton = ({
  handleRedirect,
  handleTokenPass
}: SignTokenButtonProps) => {
  const { isConnected } = useAccount();
  const { token, signToken, loading, error } = useAuth();

  useEffect(() => {
    const handleEffect = async () => {
      if (token && isConnected) {
        await handleTokenPass?.(token);
        handleRedirect();
      }
    };
    handleEffect();
  }, [handleRedirect, handleTokenPass, isConnected, token]);

  return token && isConnected ? (
    <p className='w-full max-w-md rounded-[4px] bg-white dark:bg-[#2D3748] border-[1px] dark:border-gray-600 px-[14px] py-[8px] text-center text-[16px] font-bold text-gray-800 dark:text-alpha-900'>
      {error
        ? 'Something went wrong. Please try again.'
        : loading
        ? 'You should get a signature request from your wallet, Approve it to continue.'
        : 'You are logged in 🚀'}
    </p>
  ) : (
    <button
      type='button'
      disabled={!isConnected}
      className='w-[146px] justify-center rounded-[4px] px-[14px] py-[8px] text-[16px] font-bold shadow-sm duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-500 dark:disabled:text-gray-400'
      onClick={signToken}
      aria-label='Sign Token'
    >
      Sign Token
    </button>
  );
};
