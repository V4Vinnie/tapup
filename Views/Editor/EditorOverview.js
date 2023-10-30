import { useEffect, useState } from 'react';
import {
	FlatList,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import BGDark from '../../assets/logo/darkBG.png';
import { AddFrame } from '../../Components/AddFrame';
import { Back } from '../../Components/Back';
import { Loading } from '../../Components/Loading';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { Colors } from '../../Constants/Colors';
import { useTaps } from '../../Providers/TapsProvider';
import { useUser } from '../../Providers/UserProvider';
import { fetchFramesForCreator } from '../../utils/fetch';
import { width } from '../../utils/UseDimensoins';
import uuid from 'uuid';
import { PageHeader } from '../../Components/PageHeader';
import blueBG from '../../assets/bleuBG.png';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditFrameContent } from './EditFrameContent';
import { EditFrame } from './EditFrame';

const EditorOverview = ({ navigation, setEditorFrame }) => {
	const { user, setUser } = useUser();
	const { taps } = useTaps();
	useEffect(() => {
		const getFrames = async () => {
			let createdFrames = [];
			for (let i = 0; i < taps.length; i++) {
				const tap = taps[i];

				for (let ind = 0; ind < tap.topics.length; ind++) {
					const topic = tap.topics[ind];

					const topicCreated = await fetchFramesForCreator(
						tap.id,
						topic.id,
						user.id
					);
					if (topicCreated) {
						createdFrames = createdFrames.concat(topicCreated);
					}
				}
			}
			setUser({ ...user, frames: createdFrames });
		};

		getFrames();
	}, []);

	const clickAddFrame = () => {
		setEditorFrame({
			added: Date.now(),
			contents: [],
			creator: user.id,
			description: '',
			id: uuid.v4(),
			img: '',
			tapId: '',
			title: '',
			topicId: '',
			isNew: true,
		});
		navigation.navigate('editFrame');
	};

	const TopicWidth = width / 3;
	if (!user.frames) {
		return <Loading />;
	} else {
		return (
			<>
				<AddFrame clickNav={clickAddFrame} />
				<PageHeader
					titleName={'Your frames'}
					backgroundColor={Colors.primary.lightBleu}
				/>
				<SafeAreaView>
					<ImageBackground
						source={blueBG}
						imageStyle={{ height: 530, top: -200, zIndex: -10 }}
					>
						<FlatList
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
							data={user.frames}
							numColumns={3}
							renderItem={({ item }) => (
								<TopicRectApp
									topic={item}
									setEditorFrame={setEditorFrame}
									width={TopicWidth - 10}
									height={200}
									navigation={navigation}
								/>
							)}
							keyExtractor={(frame) => frame.id}
							contentContainerStyle={{ height: '100%' }}
						/>
					</ImageBackground>
				</SafeAreaView>
			</>
		);
	}
};

const Stack = createNativeStackNavigator();

export const EditorView = ({}) => {
	const [editorFrame, setEditorFrame] = useState(null);

	const { user, setUser } = useUser();

	const removedFrameLocal = (removeID) => {
		const frameIndex = user.frames.filter((e) => removeID !== e.id);

		setUser({ ...user, frames: frameIndex });
	};

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName='editorOverview'
		>
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
					<EditFrameContent
						{...props}
						editorFrame={editorFrame}
						setEditorFrame={setEditorFrame}
					/>
				)}
			</Stack.Screen>
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		marginTop: 5,
		marginBottom: 20,
	},

	titleText: {
		textAlign: 'center',
		fontSize: 34,
		color: Colors.primary.white,
		fontWeight: 'bold',
	},

	framesScroll: {
		height: '100%',
		flexDirection: 'row',
		width: '100%',
	},
});
