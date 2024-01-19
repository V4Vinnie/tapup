import { useNavigation } from '@react-navigation/native';
import {
	StyleProp,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from 'react-native';
import { Header } from 'react-native-elements';
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

	const foregroundColor = overrideTheme
		? overrideTheme === 'dark'
			? themeColors.dark.headerPrimaryColor
			: themeColors.light.headerPrimaryColor
		: darkIcons || headerWithBackground
		? themeColors[mode].headerPrimaryColor
		: themeColors.white;
	return (
		<Header
			leftComponent={
				<TouchableWithoutFeedback
					onPress={() => {
						headerWithBack ? navigation.goBack() : null;
					}}>
					{headerWithBack ? (
						<View className='pr-4'>
							<Icon
								name='arrowleft'
								size={24}
								color={iconColor ?? foregroundColor}
							/>
						</View>
					) : (
						<View></View>
					)}
				</TouchableWithoutFeedback>
			}
			centerComponent={
				!centerComponent
					? {
							text: title,
							style: {
								color: foregroundColor,
								fontSize: FONTS.SIZE.XL,
								// TODO: Add fontFamily here
							},
					  }
					: centerComponent
			}
			centerContainerStyle={centerContainerStyle}
			rightComponent={
				rightIcon && (
					<TouchableWithoutFeedback
						onPress={() => {
							onRightIconPress();
						}}>
						<View className='mr-4'>{rightIcon}</View>
					</TouchableWithoutFeedback>
				)
			}
			statusBarProps={{ translucent: true }}
			containerStyle={[
				!transparentHeader && containerShadow,
				headerWithBackground && containerStyle,
				transparentHeader && transparentContainerStyle,
				bottomMargin,
			]}
		/>
	);
};

const { colors: themeColors } = settings.theme.extend;
const mode = themeColors.darkMode ? 'dark' : 'light';

const centerContainerStyle: StyleProp<ViewStyle> = {
	justifyContent: 'center',
	zIndex: 1,
	alignItems: 'center',
};
const containerShadow: StyleProp<ViewStyle> = {
	shadowColor: themeColors[mode].secondaryBackground,
	shadowOffset: {
		width: 0,
		height: 1,
	},
	shadowOpacity: 0.1,
	shadowRadius: 2.22,

	elevation: 3,
};
const containerStyle: StyleProp<ViewStyle> = {
	backgroundColor: themeColors[mode].headerBackground,
	zIndex: 2,
	paddingTop: 20,
	paddingBottom: 30,
};
const transparentContainerStyle: StyleProp<ViewStyle> = {
	position: 'absolute',
	width: '85%',
	backgroundColor: 'transparent',
	borderBottomWidth: 0,
	zIndex: 2,
	marginTop: 5,
};

export default AppHeader;
