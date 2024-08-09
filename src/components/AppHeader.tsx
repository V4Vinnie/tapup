import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import settings from '../../tailwind.config';
import { FONTS } from '../utils/constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Routes';

type Props = {
	title: string;
	headerWithBack?: boolean;
	rightIcon?: JSX.Element;
	onRightIconPress?: () => void;
	iconColor?: string;
	transparentHeader?: boolean;
	headerWithBackground?: boolean;
	bottomMargin?: StyleProp<ViewStyle>;
	overrideTheme?: 'dark' | 'light' | false;
	darkIcons?: boolean;
	centerComponent?: JSX.Element;
};

const AppHeader = ({
	title,
	headerWithBack,
	rightIcon,
	onRightIconPress = () => {},
	iconColor,
	transparentHeader = false,
	headerWithBackground = false,
	bottomMargin = {
		marginBottom: '2%',
		borderBottomWidth: 0,
	},
	overrideTheme = false,
	darkIcons = false,
	centerComponent,
}: Props) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const { colors: themeColors } = settings.theme.extend;
	const mode = themeColors.darkMode ? 'dark' : 'light';

	return (
		<View style={[
			styles.container,
			headerWithBackground && styles.containerWithBackground,
			transparentHeader && styles.transparentContainer,
			bottomMargin,
			styles.alwaysHeaderStyle,
		]}>
			<StatusBar
				translucent
				backgroundColor="transparent"
				barStyle={darkIcons ? 'dark-content' : 'light-content'}
			/>
			<View style={styles.headerContent}>
				<View style={styles.leftComponent}>
					{headerWithBack && (
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<View style={styles.backButton}>
								<Icon
									name="arrowleft"
									size={24}
									color={themeColors[mode].textColor}
								/>
							</View>
						</TouchableOpacity>
					)}
				</View>
				<View style={styles.centerComponent}>
					{!centerComponent ? (
						<Text style={[styles.titleText, { color: themeColors[mode].textColor }]}>
							{title}
						</Text>
					) : (
						centerComponent
					)}
				</View>
				<View style={styles.rightComponent}>
					{rightIcon && (
						<TouchableOpacity onPress={onRightIconPress}>
							<View style={styles.rightIcon}>{rightIcon}</View>
						</TouchableOpacity>
					)}
				</View>
			</View>
		</View>
	);
};

const styles = {
	container: {
		backgroundColor: 'transparent',
		borderBottomWidth: 0,
		zIndex: 2,
	},
	containerWithBackground: {
		backgroundColor: settings.theme.extend.colors[settings.theme.extend.colors.darkMode ? 'dark' : 'light'].secondaryBackground,
		paddingBottom: 30,
		marginTop: 0,
		paddingTop: 0,
	},
	transparentContainer: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderBottomWidth: 0,
	},
	alwaysHeaderStyle: {
		borderBottomWidth: 0,
	},
	headerContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: 56,
	},
	leftComponent: {
		flex: 1,
	},
	centerComponent: {
		flex: 3,
		alignItems: 'center',
	},
	rightComponent: {
		flex: 1,
		alignItems: 'flex-end',
	},
	backButton: {
		paddingRight: 16,
		paddingLeft: 8,
		paddingVertical: 8,
	},
	titleText: {
		fontSize: FONTS.SIZE.XL,
		fontFamily: FONTS.FAMILY.MEDIUM,
		textAlign: 'center',
	},
	rightIcon: {
		marginRight: 16,
	},
} as const;

export default AppHeader;