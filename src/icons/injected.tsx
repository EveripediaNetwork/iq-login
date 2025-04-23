import React, { type FC } from "react";
import { Icon, type IconProps } from "./index";

export const Injected: FC<IconProps> = (props) => {
	return (
		<Icon {...props}>
			<circle opacity="0.2" cx="16" cy="16" r="16" fill="#FFCCE4" />
			<g clipPath="url(#clip0_2936_3303)">
				<path
					d="M7.66663 13.5H23.5C23.721 13.5 23.9329 13.5878 24.0892 13.7441C24.2455 13.9004 24.3333 14.1123 24.3333 14.3333V22.6667C24.3333 22.8877 24.2455 23.0996 24.0892 23.2559C23.9329 23.4122 23.721 23.5 23.5 23.5H8.49996C8.27895 23.5 8.06698 23.4122 7.9107 23.2559C7.75442 23.0996 7.66663 22.8877 7.66663 22.6667V13.5ZM8.49996 8.5H21V11.8333H7.66663V9.33333C7.66663 9.11232 7.75442 8.90036 7.9107 8.74408C8.06698 8.5878 8.27895 8.5 8.49996 8.5V8.5ZM18.5 17.6667V19.3333H21V17.6667H18.5Z"
					fill="#FF5CAA"
				/>
			</g>
			<defs>
				<clipPath id="clip0_2936_3303">
					<rect
						width="20"
						height="20"
						fill="white"
						transform="translate(6 6)"
					/>
				</clipPath>
			</defs>
		</Icon>
	);
};
