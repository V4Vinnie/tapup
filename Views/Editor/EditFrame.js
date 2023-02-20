import {
	FlatList,
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView,
} from 'react-native';
import { width } from '../../utils/UseDimensoins';
import BGDark from '../../assets/logo/darkBG.png';
import { Colors } from '../../Constants/Colors';
import { Back } from '../../Components/Back';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTaps } from '../../Providers/TapsProvider';
import { findById, findWatchedFrameIndex } from '../../utils/findById';
import { AddFrame } from '../../Components/AddFrame';
import { EditorFrameContent } from './EditFrameContent';
import { cacheImages, cacheVideo } from '../../utils/downloadAssets';
import { useIsFocused } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { deleteFrame, updateFrame } from '../../utils/fetch';
import { useUser } from '../../Providers/UserProvider';
import { async } from '@firebase/util';

export const EditFrame = ({ editorFrame, navigation }) => {
	const { user, setUser } = useUser();
	const { taps } = useTaps();
	const isFocused = useIsFocused();
	const isNew = Object.keys(editorFrame).length === 0 ? true : false;

	const [tapTopic, setTapTopics] = useState();

	const [titleEdit, setTitleEdit] = useState(editorFrame.title);
	const [tapCategory, setTapCategory] = useState(editorFrame.tapId);
	const [topicCategory, setTopicCategory] = useState(editorFrame.topicId);
	const [descriptionEdit, setDescriptionEdit] = useState(
		editorFrame.description
	);

	const [editorContent, setEditorContent] = useState(undefined);

	const [prevTap, setPrevTap] = useState(editorFrame.tapId);
	const [prevTopic, setPrevTopic] = useState(editorFrame.topicId);

	useEffect(() => {
		if (tapCategory) {
			const _topics = findById(taps, tapCategory);
			setTapTopics(_topics[0].topics);
		} else {
			setTapTopics(taps[0].topics);
		}
		// const cacheContent = async () => {
		// 	let _frameContens = [...editorFrame.contents];
		// 	let imgs = [];
		// 	let videos = [];
		// 	_frameContens.map((_content) => {
		// 		const contentURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${_content.content}?alt=media`;

		// 		if (_content.type === 'image') {
		// 			imgs.push(contentURL);
		// 		} else if (_content.type === 'video') {
		// 			videos.push(contentURL);
		// 		}
		// 	});
		// 	try {
		// 		const downloaded = await Promise.all([
		// 			...cacheVideo(videos),
		// 			...cacheImages(imgs),
		// 		]);

		// 		for (let index = 0; index < _frameContens.length; index++) {
		// 			_frameContens[index].content = downloaded[index].localUri;
		// 		}
		// 	} catch (e) {
		// 	} finally {
		// 		setEditorContent(_frameContens);
		// 	}
		// };

		// cacheContent();
	}, [isFocused]);

	const setTapCat = (tapId) => {
		setTapCategory(tapId);
		const _topics = findById(taps, tapId);
		setTapTopics(_topics[0].topics);
		setTopicCategory(_topics[0].topics[0].id);
	};

	const addContent = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			aspect: [16, 9],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const manipResult = await manipulateAsync(result.assets[0].uri, [], {
				compress: 0.4,
				format: SaveFormat.PNG,
			});
			console.log(manipResult);
		}
	};

	const saveFrame = async () => {
		if (!isNew) {
			const _frame = {
				added: editorFrame.added,
				contents: editorFrame.contents,
				creator: user.id,
				description: descriptionEdit,
				id: editorFrame.id.trim(),
				img: editorFrame.img,
				tapId: tapCategory,
				title: titleEdit,
				topicId: topicCategory,
			};
			await updateFrame(_frame);
			setPrevTap(tapCategory);
			setPrevTopic(topicCategory);
			if (prevTap !== tapCategory || prevTopic !== topicCategory) {
				deleteFrame(prevTap, prevTopic, editorFrame.id);
			}
			const frameIndex = findWatchedFrameIndex(user.frames, editorFrame.id);
			console.log('indx', frameIndex);
			let _frames = [...user.frames];
			_frames[frameIndex] = _frame;
			setUser({ ...user, frames: _frames });
			navigation.navigate('editorOverview');
		}
	};

	return (
		<>
			<SafeAreaView style={styles.editorWrapper}>
				<View style={styles.header}>
					<Back navigate={() => navigation.goBack()} />
					<Text numberOfLines={1} style={[styles.titleText]}>
						{titleEdit}
					</Text>
					<Pressable onPress={() => saveFrame()}>
						<Text style={styles.saveText}>Save</Text>
					</Pressable>
				</View>
				<ScrollView
					style={styles.formWrapper}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.formSection}>
						<Text style={styles.labelText}>Frame title</Text>
						<TextInput
							onChangeText={(e) => setTitleEdit(e)}
							style={styles.editorInput}
							value={titleEdit}
						/>
					</View>
					<View style={styles.formSection}>
						<Text style={styles.labelText}>Frame description</Text>
						<TextInput
							style={styles.editorInputDesc}
							value={descriptionEdit}
							multiline
							numberOfLines={3}
							maxLength={150}
							onChangeText={(e) => setDescriptionEdit(e)}
						/>
					</View>
					<View style={styles.formSection}>
						<Text style={styles.labelText}>Tap category</Text>
						<Picker
							selectedValue={tapCategory}
							style={styles.pickerStyle}
							onValueChange={(tapId) => setTapCat(tapId)}
							itemStyle={styles.pickerItemStyle}
						>
							{taps.map((tap) => (
								<Picker.Item label={tap.title} value={tap.id} />
							))}
						</Picker>
					</View>
					{tapTopic && (
						<View style={styles.formSection}>
							<Text style={styles.labelText}>Topic category</Text>
							<Picker
								selectedValue={topicCategory}
								style={styles.pickerStyle}
								onValueChange={(topic) => setTopicCategory(topic)}
								itemStyle={styles.pickerItemStyle}
							>
								{tapTopic.map((topic) => (
									<Picker.Item label={topic.title} value={topic.id} />
								))}
							</Picker>
						</View>
					)}
					{/* <View style={styles.formSection}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<Text style={styles.labelText}>Frame content</Text>
							<Pressable onPress={() => addContent()}>
								<Entypo name='plus' size={24} color='#EEEEEE' />
							</Pressable>
						</View>

						{editorContent && (
							<FlatList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								numColumns={3}
								data={editorContent}
								renderItem={({ item }) => <EditorFrameContent item={item} />}
								keyExtractor={(content) => content.id}
							/>
						)}
					</View> */}
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	editorWrapper: {
		backgroundColor: Colors.primary.bleuBottom,
		height: '100%',
	},

	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 10,
		marginTop: 5,
		marginBottom: 20,
	},

	titleText: {
		textAlign: 'center',
		fontSize: 34,
		color: Colors.primary.white,
		fontWeight: 'bold',
		width: width / 3 + 110,
	},

	saveText: {
		color: Colors.primary.white,
		fontSize: 20,
	},

	formWrapper: {
		marginHorizontal: 15,
	},
	formSection: {
		marginVertical: 10,
	},

	labelText: {
		color: Colors.primary.white,
		fontSize: 20,
		marginBottom: 3,
	},

	editorInput: {
		backgroundColor: Colors.primary.white,
		borderRadius: 20,
		paddingHorizontal: 8,
		paddingVertical: 5,
		fontSize: 14,
	},

	editorInputDesc: {
		backgroundColor: Colors.primary.white,
		borderRadius: 5,
		paddingHorizontal: 5,
		paddingVertical: 5,
		fontSize: 12,
		height: 55,
	},

	pickerStyle: {
		width: '100%',
		height: 120,
	},

	pickerItemStyle: {
		color: Colors.primary.white,
		height: 120,
		backgroundColor: 'none',
	},
});
