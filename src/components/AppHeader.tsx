import { useNavigation } from '@react-navigation/native';
import {
	Platform,
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

	return (
		<Header
			leftComponent={
				<TouchableWithoutFeedback
					onPress={() => {
						headerWithBack ? navigation.goBack() : null;
					}}>
					{headerWithBack ? (
						<View className='pr-4 pl-2 py-2'>
							<Icon
								name='arrowleft'
								size={24}
								color={themeColors[mode].textColor}
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
								color: themeColors[mode].textColor,
								fontSize: FONTS.SIZE.XL,
								fontFamily: FONTS.FAMILY.MEDIUM,
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
				headerWithBackground && containerStyle,
				transparentHeader && transparentContainerStyle,
				bottomMargin,
				headerStyle,
			]}
			backgroundColor='transparent'
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
const containerStyle: StyleProp<ViewStyle> = {
	backgroundColor: themeColors[mode].secondaryBackground,
	zIndex: 2,
	paddingTop: Platform.OS == 'ios' ? 0 : 20,
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
const headerStyle: StyleProp<ViewStyle> = {
	marginTop: Platform.OS === 'ios' ? -48 : 0,
};

export default AppHeader;
