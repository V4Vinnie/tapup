import { useEffect } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
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

export const EditorOverview = ({ navigation, setEditorFrame }) => {
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
				<SafeAreaView>
					<ImageBackground
						resizeMode='cover'
						imageStyle={{
							width: width,
							height: 226.5,
							top: -50,
						}}
						source={BGDark}
					>
						<View style={styles.header}>
							<Back navigate={() => navigation.goBack()} />
							<Text style={[styles.titleText]}>Your frames</Text>
							<View style={{ width: 50 }}></View>
						</View>
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
