import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PrimaryGradient from './PrimaryGradient';
import { useCompany } from '../providers/CompanyProvider';

type Props = {
	title: string;
	onPress: () => void;
	buttonProps?: TouchableOpacity['props'];
	textProps?: Text['props'];
	children?: ReactNode;
};

const AppButton = ({
	title,
	onPress,
	buttonProps,
	textProps,
	children,
}: Props) => {
	const { isCompanyColorSet, companyColor } = useCompany();

	return (
		<TouchableOpacity
			{...buttonProps}
			onPress={onPress}
			className={`w-full justify-center items-center rounded-full`}>
			<PrimaryGradient
				companyColor={isCompanyColorSet ? companyColor : undefined}
				className={`w-full h-12 flex justify-center items-center rounded-full ${
					buttonProps?.className ?? ''
				}`}>
				{children ?? (
					<Text
						{...textProps}
						className={`text-white text-lg font-inter-bold ${
							textProps?.className ?? ''
						}`}>
						{title}
					</Text>
				)}
			</PrimaryGradient>
		</TouchableOpacity>
	);
};

export default AppButton;
