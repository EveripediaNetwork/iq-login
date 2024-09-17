import BoringAvatar from 'boring-avatars';
import type { AvatarComponent } from '@rainbow-me/rainbowkit';

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      alt='user'
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <BoringAvatar
      size={size}
      name={address}
      variant='pixel'
      colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
    />
  );
};
