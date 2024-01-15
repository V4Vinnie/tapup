import React from 'react';
import { TextInput, TouchableHighlight, View } from 'react-native';
import { mode, themeColors } from '../utils/constants';

type Props = {
	containerProps?: View['props'];
	inputProps?: TextInput['props'];
	rightIcon?: {
		component: JSX.Element;
		buttonProps?: TouchableHighlight['props'];
	};
	leftIcon?: {
		component: JSX.Element;
		buttonProps?: TouchableHighlight['props'];
	};
};

const AppInput = ({
	containerProps,
	inputProps,
	rightIcon,
	leftIcon,
}: Props) => {
	return (
		<View
			{...containerProps}
			className={`relative flex justify-center items-center bg-dark-secondaryBackground rounded-full ${
				containerProps?.className ?? ''
			}`}>
			<TextInput
				{...inputProps}
				className={`w-full h-12 pl-12 text-base text-white ${
					inputProps?.className ?? ''
				}`}
				placeholderTextColor={themeColors[mode].subTextColor}
			/>
			{leftIcon && (
				<View
					className={`absolute left-4 top-0 bottom-0 flex justify-center items-center ${
						leftIcon.buttonProps?.className ?? ''
					}`}>
					{leftIcon.component}
				</View>
			)}
			{rightIcon && (
				<TouchableHighlight
					{...rightIcon.buttonProps}
					className={`absolute right-0 top-0 bottom-0 flex justify-center items-center ${
						rightIcon.buttonProps?.className ?? ''
					}`}>
					{rightIcon.component}
				</TouchableHighlight>
			)}
		</View>
	);
};

export default AppInput;
