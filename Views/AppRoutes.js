import { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen } from './StartScreen';
import { SignUp } from './SignUp/SignUp';
import { Onboard } from './SignUp/Oboarding';
import { Home } from './Home/Home';
import { fetchUser } from '../utils/fetch';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Loading } from '../Components/Loading';
import { Profile } from './Profile/Profile';
import { useUser } from '../Providers/UserProvider';
import { Login } from './Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SearchView } from './Search/SearchView';
import { NavBar } from '../Components/NavBar';
import { height } from '../utils/UseDimensoins';
import { EditorView } from './Editor/EditorOverview';
import { Questions } from './Questions/Questions';
import { Goals } from './Goals/Goals';
import { Audio } from 'expo-av';
import { checkIfCreator } from '../utils/checkIfCreator';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export const AppRoutes = () => {
	const { user, setUser } = useUser();

	const [loggedIn, setLoggedIn] = useState(false);

	const [isloading, setIsLoading] = useState(true);

	const [topicDetail, setTopicDetail] = useState(null);
	const [tabDetail, setTabDetail] = useState(null);

	const [viewFrame, setViewFrame] = useState({});

	useEffect(() => {
		//signOut(auth);
		const test = async () => {
			setIsLoading(true);
			await onAuthStateChanged(auth, async (user) => {
				if (user) {
					const _user = await fetchUser(user.uid);
					if (_user.selectedTopics) {
						setUser(_user);
						setLoggedIn(true);
						setIsLoading(false);
					}
				} else {
					setIsLoading(false);
				}
			});
		};
		test();

		Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
	}, []);

	if (!isloading) {
		return (
			<NavigationContainer>
				{!loggedIn ? (
					<Stack.Navigator
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen name='start'>
							{(props) => <StartScreen {...props} />}
						</Stack.Screen>

						<Stack.Screen name='sign-up'>
							{(props) => <SignUp {...props} signUp={setUser} />}
						</Stack.Screen>

						<Stack.Screen name='onboard'>
							{(props) => <Onboard setLoggedIn={setLoggedIn} {...props} />}
						</Stack.Screen>

						<Stack.Screen name='login'>
							{(props) => <Login {...props} />}
						</Stack.Screen>
					</Stack.Navigator>
				) : (
					<>
						<Tab.Navigator
							tabBar={(props) => <NavBar {...props} />}
							screenOptions={{
								headerShown: false,
								tabBarStyle: { position: 'absolute', backgroundColor: 'none' },
							}}
							initialRouteName={'Home'}
							sceneContainerStyle={{ height: height }}
						>
							<Tab.Screen name='Home'>
								{(props) => (
									<Home
										topicDetail={topicDetail}
										tabDetail={tabDetail}
										viewFrame={viewFrame}
										setTopicDetail={setTopicDetail}
										setTabDetail={setTabDetail}
										setViewFrame={setViewFrame}
										setLoggedIn={setLoggedIn}
										{...props}
									/>
								)}
							</Tab.Screen>

							<Tab.Screen name='Goals'>
								{(props) => <Goals {...props} />}
							</Tab.Screen>

							<Tab.Screen name='Questions'>
								{(props) => <Questions {...props} />}
							</Tab.Screen>

							<Tab.Screen name='Search'>
								{(props) => (
									<SearchView setTopicDetail={setTopicDetail} {...props} />
								)}
							</Tab.Screen>

							<Tab.Screen name='Profile'>
								{(props) => (
									<Profile
										{...props}
										setViewFrame={setViewFrame}
										setLoggedIn={setLoggedIn}
									/>
								)}
							</Tab.Screen>

							{checkIfCreator(user.role) && (
								<Tab.Screen name='Editor'>
									{(props) => <EditorView {...props} />}
								</Tab.Screen>
							)}
						</Tab.Navigator>
					</>
				)}
			</NavigationContainer>
		);
	} else {
		return <Loading />;
	}
};
