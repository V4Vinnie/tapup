import {
	FlatList,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView,
	ImageBackground,
} from 'react-native';
import { height, width } from '../../utils/UseDimensoins';
import { Colors } from '../../Constants/Colors';
import { Back } from '../../Components/Back';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useTaps } from '../../Providers/TapsProvider';
import { findById, findWatchedFrameIndex } from '../../utils/findById';
import { cacheContents } from '../../utils/downloadAssets';
import { useIsFocused } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { deleteFrame, updateFrame } from '../../utils/fetch';
import { useUser } from '../../Providers/UserProvider';
import { Loading } from '../../Components/Loading';
import { EditFrameContent } from './EditFrameContent';
import uuid from 'uuid';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { EditContent } from './EditContent';
import { none } from '@hookstate/core';
import BGDark from '../../assets/logo/darkBG.png';

export const EditFrame = ({ editorFrame, navigation, setEditorFrame }) => {
	const { user, setUser } = useUser();
	const { taps } = useTaps();
	const isFocused = useIsFocused();
	const isNew = Object.keys(editorFrame).length === 0 ? true : false;

	const [loading, setLoading] = useState(true);

	const [tapTopic, setTapTopics] = useState();

	const [titleEdit, setTitleEdit] = useState(editorFrame.title);
	const [tapCategory, setTapCategory] = useState(editorFrame.tapId);
	const [topicCategory, setTopicCategory] = useState(editorFrame.topicId);
	const [descriptionEdit, setDescriptionEdit] = useState(
		editorFrame.description
	);

	const [editorContent, setEditorContent] = useState([]);

	const [prevTap, setPrevTap] = useState(editorFrame.tapId);
	const [prevTopic, setPrevTopic] = useState(editorFrame.topicId);

	const [editContent, setEditContent] = useState();

	useEffect(() => {
		if (tapCategory) {
			const _topics = findById(taps, tapCategory);
			setTapTopics(_topics[0].topics);
		} else {
			setTapTopics(taps[0].topics);
		}
		const cacheContent = async () => {
			setLoading(true);
			let _frameContens = [...editorFrame.contents];
			let contents = [];

			for (let index = 0; index < _frameContens.length; index++) {
				const _content = _frameContens[index];

				const contentURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${_content.content}?alt=media`;

				if (_content.type === 'image') {
					contents.push(contentURL);
				} else if (_content.type === 'video') {
					contents.push(contentURL);
				}
			}

			try {
				const downloaded = await Promise.all([...cacheContents(contents)]);

				for (let index = 0; index < _frameContens.length; index++) {
					_frameContens[index].contentUrl = downloaded[index].localUri;
					const thumbURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${_frameContens[index].thumbnail}.png?alt=media`;
					_frameContens[index].thumbnailUrl = thumbURL;
					// try {
					// 	const downloadThumb = await Promise.all([
					// 		...cacheImages([thumbURL]),
					// 	]);

					// } catch (error) {
					// 	console.log('error', error);
					// }
				}
			} catch (e) {
			} finally {
				setEditorContent(_frameContens);
				setLoading(false);
			}
		};
		if (!isNew) {
			cacheContent();
		}
	}, [isFocused, editorFrame]);

	const setTapCat = (tapId) => {
		setTapCategory(tapId);
		const _topics = findById(taps, tapId);
		setTapTopics(_topics[0].topics);
		setTopicCategory(_topics[0].topics[0].id);
	};

	const generateThumbnail = async (url) => {
		try {
			const { uri } = await VideoThumbnails.getThumbnailAsync(url, {
				time: 0,
			});
			return uri;
		} catch (e) {
			console.warn(e);
		}
	};

	const addContent = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			aspect: [16, 9],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			if (result.assets[0].duration === null) {
				const manipResult = await manipulateAsync(result.assets[0].uri, [], {
					compress: 0.4,
					format: SaveFormat.PNG,
				});

				const contentFetch = await fetch(manipResult.uri);

				console.log('manipulate', manipResult);
				const id = uuid.v4();
				const newImg = {
					content: `${id}.png`,
					contentUrl: contentFetch.url,
					thumbnail: `thumbnail_${id}`,
					thumbnailUrl: contentFetch.url,
					type: 'image',
					time: 20000,
					isNew: true,
				};

				setEditContent(newImg);
				setEditorContent([...editorContent, newImg]);
			} else {
				const thumb = await generateThumbnail(result.assets[0].uri);
				const id = uuid.v4();
				const newVid = {
					content: `${id}.${result.assets[0].fileName
						.split('.')[1]
						.toLowerCase()}`,
					contentUrl: result.assets[0].uri,
					type: 'video',
					time: result.assets[0].duration,
					thumbnail: thumb,
					isNew: true,
				};
				setImageText([]);
				setEditContent(newVid);
				setEditorContent([...editorContent, newVid]);
			}
		}
	};

	const uploadThumbnail = async (thumbBlob, thumbName) => {
		console.log('MADE BLOB', thumbBlob);

		const storageRef = ref(storage, `frames/${editorFrame.id}/${thumbName}`);

		await uploadBytes(storageRef, thumbBlob);
	};

	const saveFrame = async () => {
		if (!isNew) {
			let _content = [];

			let prevURL = [];
			let prevThumbURL = [];

			for (let index = 0; index < editorContent.length; index++) {
				const item = editorContent[index];
				prevURL.push(item.contentUrl);
				prevThumbURL.push(item.thumbnailUrl);

				const thumbFetch = await fetch(item.thumbnailUrl);
				const thumbBlob = await thumbFetch.blob();

				// await uploadThumbnail(thumbBlob, `${item.thumbnail}.png`);

				if (item.isNew) {
					const contentFetch = await fetch(item.contentUrl);
					const contentBlob = await contentFetch.blob();

					await uploadThumbnail(contentBlob, item.content);
				}

				_content.push({
					...item,
					contentUrl: null,
					thumbnailUrl: null,
					isNew: false,
				});
			}

			const _frame = {
				added: editorFrame.added,
				contents: _content,
				creator: user.id,
				description: descriptionEdit,
				id: editorFrame.id.trim(),
				img: editorFrame.img,
				tapId: tapCategory,
				title: titleEdit,
				topicId: topicCategory,
			};

			await updateFrame(_frame);

			_content.map((item, index) => {
				_content[index].contentUrl = prevURL[index];
				_content[index].thumbnailUrl = prevThumbURL[index];
			});

			_frame.contents = _content;

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

	if (loading) {
		return <Loading />;
	}

	if (editContent) {
		return (
			<EditContent
				editorContent={editorContent}
				setEditContent={setEditContent}
				editorFrame={editorFrame}
				editContent={editContent}
				setEditorFrame={setEditorFrame}
				setEditorContent={setEditorContent}
			/>
		);
	}

	return (
		<>
			<SafeAreaView style={styles.editorWrapper}>
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

							{editorContent.length === 0 ? (
								<View
									style={{
										height: height / 4 - 20,
										margin: 5,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text style={styles.noContentText}>No content yet</Text>
									<Pressable
										style={styles.addContentBtn}
										onPress={() => addContent()}
									>
										<Text style={styles.noContentText}>Add content</Text>
									</Pressable>
								</View>
							) : (
								<FlatList
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									horizontal
									data={editorContent}
									renderItem={({ item }) => (
										<EditFrameContent
											item={item}
											editThisFrame={setEditContent}
											frameID={editorFrame.id}
										/>
									)}
									keyExtractor={(content) => content.id}
								/>
							)}
						</View>
						<View style={styles.formSection}>
							<Text style={styles.labelText}>Frame title</Text>
							<TextInput
								onChangeText={(e) => setTitleEdit(e)}
								style={styles.editorInput}
								value={titleEdit}
								placeholder='Frame title here'
								placeholderTextColor='rgba(255, 255, 255, 0.6)'
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
					</ScrollView>
				</ImageBackground>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	editorWrapper: {
		backgroundColor: Colors.primary.pink,
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

	updateContentButton: {
		backgroundColor: Colors.primary.pink,
		alignSelf: 'center',
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 50,
		color: 'white',
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
		backgroundColor: none,
		color: Colors.primary.white,
		borderColor: Colors.primary.white,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontSize: 14,
	},

	editorInputDesc: {
		backgroundColor: none,
		color: Colors.primary.white,
		borderColor: Colors.primary.white,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontSize: 14,
		height: 55,
	},

	pickerStyle: {
		width: '100%',
		height: 100,
	},

	pickerItemStyle: {
		color: Colors.primary.white,
		height: 110,
		backgroundColor: 'none',
	},

	navHeading: {
		position: 'absolute',
		top: 55,
		zIndex: 500,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: 15,
	},

	backgroundVideo: {
		height: height,
		width: width,
		position: 'absolute',
		top: 0,
		left: 0,
		alignItems: 'stretch',
		bottom: 0,
		right: 0,
		zIndex: 50,
		backgroundColor: Colors.primary.bleuBottom,
	},

	noContentText: {
		color: Colors.primary.white,
		fontSize: 16,
		fontWeight: 'bold',
	},

	addContentBtn: {
		backgroundColor: Colors.primary.bleuBottom,
		alignSelf: 'center',
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 10,
	},
});
