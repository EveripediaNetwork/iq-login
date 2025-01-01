import BoringAvatar from "boring-avatars";
import { useEnsAvatar } from "wagmi";

interface CustomAvatarProps {
	address?: string;
	size?: number;
}

export const CustomAvatar = ({ address, size = 40 }: CustomAvatarProps) => {
	const { data: ensImage } = useEnsAvatar({
		name: address,
	});

	return ensImage ? (
		<img
			src={ensImage}
			alt="user"
			width={size}
			height={size}
			style={{ borderRadius: 999 }}
		/>
	) : (
		<BoringAvatar
			size={size}
			name={address}
			variant="pixel"
			colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
		/>
	);
};
