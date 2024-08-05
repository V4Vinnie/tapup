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
import TopicScreen from '../screens/TopicScreen';
import AccountScreen from '../screens/AccountScreen';
import { TopicProvider } from '../providers/TopicProvider';
import { TapProvider } from '../providers/TapProvider';
import { ProfileProvider } from '../providers/ProfileProvider';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import MyCompanyScreen from '../screens/MyComanyScreen';
import '../utils/stringExtensions';
import AddCompanyCodeScreen from '../screens/AddCompanyCodeScreen';
import { useCompany } from '../providers/CompanyProvider';

type Props = {};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const error = console.error;
console.error = (...args: any) => {
	if (/defaultProps/.test(args[0])) return;
	error(...args);
};

const RootStack = (props: Props) => {
	const { user } = useAuth();

	return user ? (
		<TopicProvider>
			<TapProvider>
				<ProfileProvider>
					<Tab.Navigator
						sceneContainerStyle={{
							backgroundColor:
								themeColors[mode].primaryBackground,
						}}
						screenOptions={{
							headerShown: false,
						}}
						tabBar={(props) => <BottomTabBar {...props} />}>
						<Tab.Screen name={Routes.HOME} component={HomeStack} />
						<Tab.Screen
							name={Routes.ACCOUNT}
							component={AccountStack}
						/>
					</Tab.Navigator>
				</ProfileProvider>
			</TapProvider>
		</TopicProvider>
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
	const { company } = useCompany();

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{company ? (
				<>
					<Stack.Screen
						name={Routes.HOME_LANDING}
						component={HomeScreen}
					/>
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
					<Stack.Screen
						name={Routes.TAP_SCREEN}
						component={TapScreen}
					/>
					<Stack.Screen
						name={Routes.TOPIC_SCREEN}
						component={TopicScreen}
					/>
				</>
			) : (
				<Stack.Screen
					name={Routes.ADD_COMPANY_CODE}
					component={AddCompanyCodeScreen}
				/>
			)}
		</Stack.Navigator>
	);
};

const AccountStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name={Routes.ACCOUNT_LANDING}
				component={AccountScreen}
			/>
			<Stack.Screen
				name={Routes.ACCOUNT_SETTINGS}
				component={AccountSettingsScreen}
			/>
			<Stack.Screen
				name={Routes.PRIVACY_POLICY}
				component={PrivacyPolicyScreen}
			/>
			<Stack.Screen
				name={Routes.MY_COMPANY}
				component={MyCompanyScreen}
			/>
		</Stack.Navigator>
	);
};

export default RootStack;
