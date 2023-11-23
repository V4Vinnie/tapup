import { useState } from 'react';

import { useUser } from '../../Providers/UserProvider';
import { useTaps } from '../../Providers/TapsProvider';
import { HomeView } from './HomeView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabDetail } from '../Detail/TabDetail';
import { TopicDetail } from '../Detail/TopicDetail';
import { Frames } from '../../Components/FrameRelated/Frames';
import { checkIfCreator } from '../../utils/checkIfCreator';

const Stack = createNativeStackNavigator();

export const Home = ({
	navigation,
	setLoggedIn,
	topicDetail,
	setTopicDetail,
	tabDetail,
	setTabDetail,
	viewFrame,
	setViewFrame,
}) => {
	const { taps, setTaps } = useTaps();

	const { user, setUser } = useUser();

	const [search, setSearch] = useState(false);
	const [paddingHeight, setPaddingHeight] = useState(110);

	const onBackClick = () => {
		setPaddingHeight(110);
		setSearch(false);
	};

	const goDashboard = () => {
		navigation.navigate('profile');
	};

	return (
		<>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name='homeView'>
					{(props) => (
						<HomeView
							setTopicDetail={setTopicDetail}
							setTabDetail={setTabDetail}
							setLoggedIn={setLoggedIn}
							setViewFrame={setViewFrame}
							{...props}
						/>
					)}
				</Stack.Screen>

				<Stack.Screen name='tabDetail'>
					{(props) => (
						<TabDetail
							setTopicDetail={setTopicDetail}
							tab={tabDetail}
							setViewFrame={setViewFrame}
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

				{checkIfCreator(user.role) && (
					<>
						<Stack.Screen name='editorOverview'>
							{(props) => (
								<EditorOverview {...props} setEditorFrame={setEditorFrame} />
							)}
						</Stack.Screen>

						<Stack.Screen name='editFrame'>
							{(props) => (
								<EditFrame
									{...props}
									editorFrame={editorFrame}
									removedFrameLocal={removedFrameLocal}
								/>
							)}
						</Stack.Screen>

						<Stack.Screen name='editContent'>
							{(props) => (
								<EditorFrameContent
									{...props}
									editorFrame={editorFrame}
									setEditorFrame={setEditorFrame}
								/>
							)}
						</Stack.Screen>
					</>
				)}
			</Stack.Navigator>
		</>
	);
};
