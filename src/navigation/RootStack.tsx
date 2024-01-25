import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, Routes } from './Routes';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { useAuth } from '../providers/AuthProvider';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import BottomTabBar from '../components/BottomTabBar';
import SearchScreen from '../screens/SearchScreen';
import SeeMoreTapsScreen from '../screens/SeeMoreScreens/SeeMoreTapsScreen';
import SeeMoreProfilesScreen from '../screens/SeeMoreScreens/SeeMoreProfilesScreen';
import SeeMoreTopicsScreen from '../screens/SeeMoreScreens/SeeMoreTopicsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TapScreen from '../screens/TapScreen';
import { mode, themeColors } from '../utils/constants';

type Props = {};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const RootStack = (props: Props) => {
	const { user } = useAuth();

	return user ? (
		<Tab.Navigator
			sceneContainerStyle={{
				backgroundColor: themeColors[mode].primaryBackground,
			}}
			screenOptions={{
				headerShown: false,
			}}
			tabBar={(props) => <BottomTabBar {...props} />}>
			<Tab.Screen name={Routes.HOME} component={HomeStack} />
		</Tab.Navigator>
	) : (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name={Routes.WELCOME} component={WelcomeScreen} />
			<Stack.Screen name={Routes.LOGIN} component={LoginScreen} />
			<Stack.Screen name={Routes.SIGNUP} component={SignupScreen} />
			<Stack.Screen
				name={Routes.FORGOT_PASSWORD}
				component={ForgotPasswordScreen}
			/>
		</Stack.Navigator>
	);
};

const HomeStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name={Routes.HOME_LANDING} component={HomeScreen} />
			<Stack.Screen
				name={Routes.SEARCH_SCREEN}
				component={SearchScreen}
			/>
			<Stack.Screen
				name={Routes.SEE_MORE_TAPS}
				component={SeeMoreTapsScreen}
			/>
			<Stack.Screen
				name={Routes.SEE_MORE_PROFILES}
				component={SeeMoreProfilesScreen}
			/>
			<Stack.Screen
				name={Routes.SEE_MORE_TOPICS}
				component={SeeMoreTopicsScreen}
			/>
			<Stack.Screen
				name={Routes.PROFILE_SCREEN}
				component={ProfileScreen}
			/>
			<Stack.Screen name={Routes.TAP_SCREEN} component={TapScreen} />
		</Stack.Navigator>
	);
};

export default RootStack;
