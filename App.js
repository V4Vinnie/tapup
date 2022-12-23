import { useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Logo } from './Components/SVG/Logo';
import { Colors } from './Constants/Colors';
import { bodyText, buttonStyle } from './style';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StartScreen } from './Views/StartScreen';
import { SignUp } from './Views/SignUp/SignUp';
import { SignUpTopics } from './Views/SignUp/SignUpTopics';
import { Onboard } from './Views/SignUp/Oboarding';
import { Home } from './Views/Home/Home';
import { Topics } from './Constants/Topics';
import { TopicDetail } from './Views/Detail/TopicDetails';

const Stack = createNativeStackNavigator();

export default function App() {
	const [user, setUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [topicDetail, setTopicDetail] = useState(null);

	const LogIn = (email, name, img, navigator) => {
		setUser({
			name: name,
			email: email,
			profilePic: img,
			selectedTopics: [Topics[1].id, Topics[2].id, Topics[5].id],
		});
		setLoggedIn(true);
		navigator.navigate('home');
	};
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				{!loggedIn ? (
					<Stack.Screen name='start'>
						{(props) => <StartScreen {...props} logginPress={LogIn} />}
					</Stack.Screen>
				) : null}
				<Stack.Screen name='home'>
					{(props) => (
						<Home setTopicDetail={setTopicDetail} user={user} {...props} />
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

				<Stack.Screen name='detail'>
					{(props) => <TopicDetail topic={topicDetail} {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
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
