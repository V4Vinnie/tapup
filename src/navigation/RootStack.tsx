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

type Props = {};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const RootStack = (props: Props) => {
	const { user } = useAuth();

	return user ? (
		<Tab.Navigator
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
		</Stack.Navigator>
	);
};

export default RootStack;
