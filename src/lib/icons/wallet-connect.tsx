import type React from "react";
import { Icon, type IconProps } from "./index";

export const WalletConnect: React.FC<IconProps> = (props) => {
	return (
		<Icon {...props}>
			<circle opacity="0.2" cx="16" cy="16" r="16" fill="#3A99FB" />
			<path
				d="M24.6392 14.6175L25.8741 15.8266C26.0427 15.9916 26.0427 16.2591 25.8741 16.4241L20.3056 21.8763C20.1371 22.0412 19.8639 22.0412 19.6954 21.8763L15.7432 18.0067C15.7011 17.9655 15.6328 17.9655 15.5906 18.0067L11.6386 21.8763C11.4701 22.0412 11.1968 22.0412 11.0283 21.8763L5.45972 16.424C5.29126 16.2591 5.29126 15.9916 5.45972 15.8265L6.69476 14.6175C6.86311 14.4524 7.13643 14.4524 7.3049 14.6175L11.2572 18.4871C11.2993 18.5282 11.3676 18.5282 11.4097 18.4871L15.3617 14.6175C15.5303 14.4524 15.8035 14.4524 15.9719 14.6175L19.9242 18.4871C19.9663 18.5282 20.0346 18.5282 20.0768 18.4871L24.0289 14.6175C24.1974 14.4525 24.4706 14.4525 24.6392 14.6175ZM9.56424 11.8078C12.9346 8.50798 18.3992 8.50798 21.7696 11.8078L22.1752 12.205C22.3436 12.37 22.3436 12.6375 22.1752 12.8025L20.7875 14.1611C20.7034 14.2436 20.5666 14.2436 20.4825 14.1611L19.9243 13.6146C17.573 11.3125 13.7608 11.3125 11.4096 13.6146L10.8118 14.1999C10.7275 14.2823 10.591 14.2823 10.5067 14.1999L9.1191 12.8413C8.95064 12.6763 8.95064 12.4088 9.1191 12.2438L9.56424 11.8078Z"
				fill="#3A99FB"
			/>
		</Icon>
	);
};
