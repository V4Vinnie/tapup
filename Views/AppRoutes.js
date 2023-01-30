import { createContext, useContext, useEffect, useState } from 'react';
import { LogBox, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { bodyText, buttonStyle } from '../style';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen } from './StartScreen';
import { SignUp } from './SignUp/SignUp';
import { SignUpTopics } from './SignUp/SignUpTopics';
import { Onboard } from './SignUp/Oboarding';
import { Home } from './Home/Home';
import { TopicDetail } from './Detail/TopicDetail';
import { TabDetail } from './Detail/TabDetail';
import { fetchTaps, fetchTopics, fetchUser } from '../utils/fetch';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Frames } from '../Components/Frames';
import { Loading } from '../Components/Loading';
import { Profile } from './Profile/Profile';
import { useUser } from '../Providers/UserProvider';
import { useTaps } from '../Providers/TapsProvider';

const Stack = createNativeStackNavigator();

export const AppRoutes = () => {
	const { setUser } = useUser();

	const { taps, setTaps } = useTaps();

	const [loggedIn, setLoggedIn] = useState(false);
	const [topicDetail, setTopicDetail] = useState(null);
	const [tabDetail, setTabDetail] = useState(null);

	const [viewFrame, setViewFrame] = useState({});

	const [isLogginIn, setIsLogginIn] = useState(false);

	const [isloading, setIsLoading] = useState(true);

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
			setTaps(_taps);
			console.log('taps', taps);

			await onAuthStateChanged(auth, async (user) => {
				if (user) {
					const _user = await fetchUser(user.uid);
					if (_user.selectedTopics) {
						console.log('RunnedChange');
						setUser(_user);
						setLoggedIn(true);
					}
				}
			});

			setIsLoading(false);
		};

		test();
	}, []);

	const LogIn = async (navigator, directLogin) => {
		setIsLogginIn(true);
		await signInWithEmailAndPassword(auth, 'ciel@test.be', 'test123')
			.then(async (userCredential) => {
				// Signed in
				const _user = await fetchUser(userCredential.user.uid);
				console.log('USER', _user);
				setUser(_user);
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
									<SignUpTopics {...props} setLoggedIn={setLoggedIn} />
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

							<Stack.Screen name='profile'>
								{(props) => <Profile {...props} />}
							</Stack.Screen>
						</>
					)}
				</Stack.Navigator>
			</NavigationContainer>
		);
	} else {
		return <Loading />;
	}
};

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
