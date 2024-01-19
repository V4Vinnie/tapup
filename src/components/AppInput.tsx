import React from 'react';
import { TextInput, TouchableHighlight, View } from 'react-native';
import { mode, themeColors } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Routes';

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
	autoFocus?: boolean;
};

const AppInput = ({
	containerProps,
	inputProps,
	rightIcon,
	leftIcon,
	autoFocus,
}: Props) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const inputRef = React.useRef<TextInput>(null);

	React.useEffect(() => {
		if (autoFocus) {
			navigation.addListener('focus', () => {
				inputRef.current?.focus();
			});
		}

		return () => {
			navigation.removeListener('focus', () => {
				inputRef.current?.focus();
			});
		};
	}, []);

	return (
		<View
			{...containerProps}
			className={`relative flex justify-center items-center bg-dark-secondaryBackground rounded-full ${
				containerProps?.className ?? ''
			}`}>
			<TextInput
				ref={inputRef}
				{...inputProps}
				className={`w-full h-12 pl-12 text-base leading-5 text-white ${
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
