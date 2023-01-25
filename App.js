import { createContext, useContext, useEffect, useState } from 'react';
import { LogBox, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from './Constants/Colors';
import { bodyText, buttonStyle } from './style';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen } from './Views/StartScreen';
import { SignUp } from './Views/SignUp/SignUp';
import { SignUpTopics } from './Views/SignUp/SignUpTopics';
import { Onboard } from './Views/SignUp/Oboarding';
import { Home } from './Views/Home/Home';
import { useTapsState } from './States/Taps';
import { TopicDetail } from './Views/Detail/TopicDetail';
import { TabDetail } from './Views/Detail/TabDetail';
import { fetchFrames, fetchTaps, fetchTopics, fetchUser } from './utils/fetch';
import {
	connectAuthEmulator,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { app, auth } from './firebaseConfig';
import { useUserState } from './States/User';
import { Frames } from './Components/Frames';
import { Loading } from './Components/Loading';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();

export default function App() {
	const [user, setUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [topicDetail, setTopicDetail] = useState(null);
	const [tabDetail, setTabDetail] = useState(null);

	const [viewFrame, setViewFrame] = useState({});

	const [isLogginIn, setIsLogginIn] = useState(false);

	const setTaps = useTapsState();
	const taps = useTapsState().get();

	const [isloading, setIsLoading] = useState(true);

	const userState = useUserState();

	useEffect(() => {
		//signOut(auth);
		const test = async () => {
			setIsLoading(true);

			const Taps = await fetchTaps();

			const _taps = [];

			for (let i = 0; i < Taps.length; i++) {
				let tap = Taps[i];
				let _topics = await fetchTopics(tap.id);

				tap.topics = _topics;

				_taps.push(tap);
			}
			setTaps.set(_taps);
			console.log('taps', taps);

			await onAuthStateChanged(auth, async (user) => {
				if (user) {
					const _user = await fetchUser(user.uid);
					if (_user.selectedTopics) {
						console.log('RunnedChange');
						userState.set(_user);
						setLoggedIn(true);
					}
				}
			});

			setIsLoading(false);
		};

		test();
	}, [user]);

	const LogIn = async (navigator, directLogin) => {
		setIsLogginIn(true);
		await signInWithEmailAndPassword(auth, 'ciel@test.be', 'test123')
			.then(async (userCredential) => {
				// Signed in
				const _user = await fetchUser(userCredential.user.uid);
				console.log('USER', _user);
				userState.set(_user);
				// ...
			})
			.catch((error) => {
				console.log(error);
			});

		if (directLogin) {
			setLoggedIn(true);
			navigator.navigate('home');
		}
		setIsLogginIn(false);
	};

	if (!isloading) {
		return (
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
				>
					{!loggedIn ? (
						<>
							<Stack.Screen name='start'>
								{(props) => (
									<StartScreen
										isLogginIn={isLogginIn}
										{...props}
										logginPress={LogIn}
									/>
								)}
							</Stack.Screen>

							<Stack.Screen name='sign-up'>
								{(props) => <SignUp {...props} signUp={setUser} />}
							</Stack.Screen>
							<Stack.Screen name='sign-up-topic'>
								{(props) => (
									<SignUpTopics
										{...props}
										setLoggedIn={setLoggedIn}
										user={user}
										changeUser={setUser}
									/>
								)}
							</Stack.Screen>

							<Stack.Screen name='onboard'>
								{(props) => <Onboard setLoggedIn={setLoggedIn} {...props} />}
							</Stack.Screen>
						</>
					) : (
						<>
							<Stack.Screen name='home'>
								{(props) => (
									<Home
										setTabDetail={setTabDetail}
										setTopicDetail={setTopicDetail}
										setLoggedIn={setLoggedIn}
										{...props}
									/>
								)}
							</Stack.Screen>

							<Stack.Screen name='tabDetail'>
								{(props) => (
									<TabDetail
										setTopicDetail={setTopicDetail}
										tab={tabDetail}
										{...props}
									/>
								)}
							</Stack.Screen>

							<Stack.Screen name='detail'>
								{(props) => (
									<TopicDetail
										setTabDetail={setTabDetail}
										topic={topicDetail}
										setViewFrame={setViewFrame}
										{...props}
									/>
								)}
							</Stack.Screen>
							<Stack.Screen name='frames'>
								{(props) => <Frames frame={viewFrame} {...props} />}
							</Stack.Screen>
						</>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		);
	} else {
		return <Loading />;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.primary.bleuBottom,
		color: Colors.primary.white,
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},

	logoConatiner: {
		display: 'flex',
		alignItems: 'center',
	},

	title: {
		fontSize: 48,
		marginTop: 50,
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: Colors.primary.white,
	},

	title: {
		fontSize: 48,
		marginTop: 50,
		textTransform: 'uppercase',
		fontWeight: 'bold',
		color: Colors.primary.white,
	},

	subTitle: {
		opacity: 0.8,
		...bodyText,
	},

	text: {
		...bodyText,
	},

	signUpContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 58,
	},

	button: {
		...buttonStyle,
	},
});
