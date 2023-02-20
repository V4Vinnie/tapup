import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
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
import { fetchUser } from '../utils/fetch';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Frames } from '../Components/Frames';
import { Loading } from '../Components/Loading';
import { Profile } from './Profile/Profile';
import { useUser } from '../Providers/UserProvider';
import { Login } from './Login';
import { EditorOverview } from './Editor/EditorOverview';
import { ROLES } from '../Constants/Roles';
import { EditFrame } from './Editor/EditFrame';

const Stack = createNativeStackNavigator();

export const AppRoutes = () => {
	const { user, setUser } = useUser();

	const [loggedIn, setLoggedIn] = useState(false);
	const [topicDetail, setTopicDetail] = useState(null);
	const [tabDetail, setTabDetail] = useState(null);

	const [viewFrame, setViewFrame] = useState({});

	const [isLogginIn, setIsLogginIn] = useState(false);

	const [isloading, setIsLoading] = useState(true);

	const [editorFrame, setEditorFrame] = useState(null);

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
					}
				}
			});

			setIsLoading(false);
		};
		test();
	}, []);

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
								{(props) => <StartScreen isLogginIn={isLogginIn} {...props} />}
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

							<Stack.Screen name='login'>
								{(props) => <Login {...props} />}
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
								{(props) => <Profile {...props} setLoggedIn={setLoggedIn} />}
							</Stack.Screen>

							{user.role === ROLES.CREATOR && (
								<>
									<Stack.Screen name='editorOverview'>
										{(props) => (
											<EditorOverview
												{...props}
												setEditorFrame={setEditorFrame}
											/>
										)}
									</Stack.Screen>

									<Stack.Screen name='editFrame'>
										{(props) => (
											<EditFrame {...props} editorFrame={editorFrame} />
										)}
									</Stack.Screen>
								</>
							)}
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
