import {
	Pressable,
	SafeAreaView,
	StyleSheet,
	TextInput,
	View,
	ScrollView,
	ImageBackground,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import { height, width } from '../../utils/UseDimensoins';
import { Colors } from '../../Constants/Colors';
import { useEffect, useState } from 'react';
import { useTaps } from '../../Providers/TapsProvider';
import { findById, findWatchedFrameIndex } from '../../utils/findById';
import { cacheContents } from '../../utils/downloadAssets';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { deleteFrame, updateFrame } from '../../utils/fetch';
import { useUser } from '../../Providers/UserProvider';
import { Loading } from '../../Components/Loading';
import uuid from 'uuid';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { EditContent } from './EditContent';
import { none } from '@hookstate/core';
import { MediumText } from '../../Components/Text/MediumText';
import { PageHeader } from '../../Components/PageHeader';
import blueBG from '../../assets/bleuBG.png';
import { Dropdown } from 'react-native-element-dropdown';
import { BlackArrow } from '../../Components/SVG/BlackArrow';
import tapTopIMG from '../../assets/tapTop_pink.png';
import { Pencil } from '../../Components/SVG/Pencil';

export const EditFrame = ({
	editorFrame,
	navigation,
	setEditorFrame,
	removedFrameLocal,
}) => {
	const { user, setUser } = useUser();
	const { taps } = useTaps();
	const isFocused = useIsFocused();

	const [loading, setLoading] = useState(true);

	const [isNew, setIsNew] = useState();

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

	const [thumbCover, setThumbCover] = useState(editorFrame.img);

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
				if (!_content.contentUrl) {
					const contentURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${_content.content}?alt=media`;

					if (_content.type === 'image') {
						contents.push(contentURL);
					} else if (_content.type === 'video') {
						contents.push(contentURL);
					}
				}
			}

			try {
				if (contents.length !== 0) {
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
				}
			} catch (e) {
			} finally {
				setEditorContent([
					{
						type: 'cover',
						thumbnailUrl: editorFrame.img.includes('/')
							? editorFrame.img
							: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2FBPuFm3XKvHw4c1pnTjjE%2F${editorFrame.img}?alt=media`,
					},
					..._frameContens,
				]);
				setLoading(false);
			}
		};
		if (!editorFrame.isNew) {
			setIsNew(false);
			cacheContent();
		} else {
			setIsNew(true);
			setEditorContent([
				{
					type: 'cover',
					isNew: true,
					thumbnailUrl: editorFrame.img.includes('/')
						? editorFrame.img
						: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2FBPuFm3XKvHw4c1pnTjjE%2F${editorFrame.img}?alt=media`,
				},
			]);
			setLoading(false);
		}
	}, [isFocused, editorFrame]);

	const setTapCat = ({ id }) => {
		console.log('vals', id);
		setTapCategory(id);
		const _topics = findById(taps, id);
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

				const id = uuid.v4();
				const newImg = {
					content: `${id}.png`,
					contentUrl: contentFetch.url,
					thumbnail: `thumbnail_${id}`,
					thumbnailUrl: contentFetch.url,
					type: 'image',
					time: 10000,
					isNew: true,
					isDeleted: false,
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
					isDeleted: false,
				};
				setImageText([]);
				setEditContent(newVid);
				setEditorContent([...editorContent, newVid]);
			}
		}
	};

	const uploadThumbnail = async (thumbBlob, thumbName) => {
		const storageRef = ref(storage, `frames/${editorFrame.id}/${thumbName}`);

		await uploadBytes(storageRef, thumbBlob);
	};

	const pickCoverpic = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const manipResult = await manipulateAsync(result.assets[0].uri, [], {
				compress: 0.5,
				format: SaveFormat.PNG,
			});

			const response = await fetch(manipResult.uri);
			const blobFile = await response.blob();

			const coverPic = `${editorFrame.id}_cover.png`;

			const storageRef = ref(storage, `frames/${editorFrame.id}/${coverPic}`);

			setThumbCover({ ...response, isLocal: true });
			setEditorFrame({ ...editorFrame, img: { ...response, isLocal: true } });
			// await uploadBytes(storageRef, blobFile).then((snapshot) => {
			// });
		}
	};

	const deleteFrameContent = async (itemName) => {
		const desertRef = ref(storage, `frames/${editorFrame.id}/${itemName}`);
		await deleteObject(desertRef)
			.then(() => {
				console.log('DELETED');
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const saveFrame = async () => {
		let _content = [];

		let prevURL = [];
		let prevThumbURL = [];

		for (let index = 1; index < editorContent.length; index++) {
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
			if (!item.isDeleted) {
				_content.push({
					...item,
					contentUrl: null,
					thumbnailUrl: null,
					isNew: false,
				});
			} else {
				deleteFrameContent(item.content);
			}
		}

		if (editorContent[0].thumbnailUrl.includes('file:')) {
			const contentFetch = await fetch(editorContent[0].thumbnailUrl);
			const contentBlob = await contentFetch.blob();
			await uploadThumbnail(
				contentBlob,
				`${editorFrame.id.trim()}_thumbnail.png`
			);
		}

		const _frame = {
			added: editorFrame.added,
			contents: _content,
			creator: user.id,
			description: descriptionEdit,
			id: editorFrame.id.trim(),
			img: `${editorFrame.id.trim()}_thumbnail.png`,
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
		_frame.img = editorContent[0].thumbnailUrl;

		setPrevTap(tapCategory);
		setPrevTopic(topicCategory);
		if (prevTap !== tapCategory || prevTopic !== topicCategory) {
			deleteFrame(prevTap, prevTopic, editorFrame.id);
		}
		const frameIndex = findWatchedFrameIndex(user.frames, editorFrame.id);

		let _frames = [...user.frames];
		_frames[frameIndex] = _frame;
		setUser({ ...user, frames: _frames });
		navigation.navigate('editorOverview');
	};

	const addCover = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [16, 9],
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			const manipResult = await manipulateAsync(result.assets[0].uri, [], {
				compress: 0.4,
				format: SaveFormat.PNG,
			});

			let _contents = [...editorContent];
			_contents[0].thumbnailUrl = manipResult.uri;
			_contents[0].isNew = false;

			setEditorContent(_contents);
		}
	};

	const deleteFrameItem = (itemID) => {
		let _contents = [...editorContent];
		const frameIndex = _contents.map((e) => e.content).indexOf(itemID);
		_contents[frameIndex].isDeleted = true;
		setEditorContent(_contents);
	};

	const deleteFullFrame = async () => {
		await deleteFrame(
			editorFrame.tapId,
			editorFrame.topicId,
			editorFrame.id,
			editorFrame.contents
		);
		removedFrameLocal(editorFrame.id);
		navigation.goBack();
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
			<PageHeader
				titleName={'Frame info'}
				backgroundColor={Colors.primary.lightBleu}
				withBack
				navigation={navigation}
			/>
			<SafeAreaView style={styles.editorWrapper}>
				<ScrollView
					style={styles.formWrapper}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<>
						{/* <View style={styles.formSection}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<MediumText style={styles.labelText}>Frame content</MediumText>
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
									<MediumText style={styles.noContentText}>
										No content yet
									</MediumText>
									<Pressable
										style={styles.addContentBtn}
										onPress={() => addContent()}
									>
										<MediumText style={styles.noContentText}>
											Add content
										</MediumText>
									</Pressable>
								</View>
							) : (
								<FlatList
									showsVerticalScrollIndicator={false}
									showsHorizontalScrollIndicator={false}
									horizontal
									data={editorContent}
									renderItem={({ item }) => {
										if (!item.isDeleted) {
											return (
												<EditFrameContent
													deleteFrame={deleteFrameItem}
													isNew={isNew}
													item={item}
													editThisFrame={setEditContent}
													frameID={editorFrame.id}
													addCover={addCover}
												/>
											);
										}
									}}
									keyExtractor={(content) => content.id}
								/>
							)}
						</View> */}
					</>
					<ImageBackground
						source={blueBG}
						imageStyle={{ height: 530, top: -230, zIndex: -10, width: width }}
						style={{ padding: 10 }}
					>
						<View style={styles.formSection}>
							<MediumText style={styles.labelText}>Frame title</MediumText>
							<TextInput
								onChangeText={(e) => setTitleEdit(e)}
								style={styles.editorInput}
								value={titleEdit}
								placeholder='Frame title here'
								placeholderTextColor='rgba(255, 255, 255, 0.6)'
							/>
						</View>

						<View style={styles.formSection}>
							<MediumText style={styles.labelText}>Tap category</MediumText>

							<Dropdown
								style={{
									width: '100%',
									padding: 0,
									textAlign: 'center',
									fontSize: 16,
									paddingHorizontal: 10,
									justifyContent: 'center',
									borderWidth: 2,
									borderRadius: 10,
									borderColor: Colors.primary.white,
								}}
								selectedTextStyle={{
									textAlign: 'left',
									fontSize: 16,
									color: Colors.primary.white,
									fontFamily: 'DMSans-Regular',
								}}
								placeholderStyle={{
									textAlign: 'left',
									fontSize: 16,
									opacity: 0.8,
									color: Colors.primary.white,
									fontFamily: 'DMSans-Regular',
								}}
								labelField='title'
								valueField='id'
								data={taps}
								placeholder='Select'
								value={tapCategory}
								itemTextStyle={{
									color: Colors.primary.black,
									fontFamily: 'DMSans-Regular',
								}}
								onChange={(tapId) => setTapCat(tapId)}
								renderRightIcon={() => (
									<BlackArrow
										color={Colors.primary.white}
										style={{
											transform: [{ rotate: '90deg' }, { scale: 1.5 }],
											marginRight: 5,
										}}
									/>
								)}
							/>
						</View>
						{tapTopic && (
							<View style={styles.formSection}>
								<MediumText style={styles.labelText}>Topic category</MediumText>

								<Dropdown
									style={{
										width: '100%',
										padding: 0,
										textAlign: 'center',
										fontSize: 16,
										paddingHorizontal: 10,

										justifyContent: 'center',
										borderWidth: 2,
										borderRadius: 10,
										borderColor: Colors.primary.white,
									}}
									selectedTextStyle={{
										textAlign: 'left',
										fontSize: 16,
										color: Colors.primary.white,
										fontFamily: 'DMSans-Regular',
									}}
									placeholderStyle={{
										textAlign: 'left',
										fontSize: 16,
										opacity: 0.8,
										color: Colors.primary.white,
										fontFamily: 'DMSans-Regular',
									}}
									labelField='title'
									valueField='id'
									data={tapTopic}
									placeholder='Select'
									value={topicCategory}
									itemTextStyle={{
										color: Colors.primary.black,
										fontFamily: 'DMSans-Regular',
									}}
									onChange={(topic) => setTopicCategory(topic)}
									renderRightIcon={() => (
										<BlackArrow
											color={Colors.primary.white}
											style={{
												transform: [{ rotate: '90deg' }, { scale: 1.5 }],
												marginRight: 5,
											}}
										/>
									)}
								/>
							</View>
						)}
					</ImageBackground>
					<View
						style={{
							alignItems: 'center',
							marginTop: 20,
						}}
					>
						<TouchableOpacity
							style={{ position: 'absolute', zIndex: 800, top: -40, right: 65 }}
							onPress={() => pickCoverpic()}
						>
							<Pencil width={50} color={Colors.primary.pink} />
						</TouchableOpacity>
						<View
							style={{
								height: 350,
								width: 230,
								backgroundColor: Colors.primary.pink,
								borderRadius: 20,
								overflow: 'hidden',
							}}
						>
							<ImageBackground
								source={
									thumbCover && thumbCover.isLocal
										? {
												uri: thumbCover.url,
										  }
										: thumbCover
										? {
												uri: `${`https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${thumbCover}?alt=media`}`,
										  }
										: {}
								}
								imageStyle={{
									backgroundColor: Colors.primary.bleuBottom,
									width: 230,
								}}
								style={{
									height: 350,
									flexDirection: 'row',
									alignItems: 'flex-end',
								}}
							>
								<View
									style={{
										width: '100%',
									}}
								>
									<Image
										style={{ marginBottom: -2, left: -35 }}
										source={tapTopIMG}
									/>
									<View
										style={{
											backgroundColor: Colors.primary.pink,
											paddingHorizontal: 10,
											paddingBottom: 15,
										}}
									>
										<Text style={styles.creatorMockText}>{user.name}</Text>
										<Text style={styles.titleMockText}>
											{titleEdit ? titleEdit : 'Title here'}
										</Text>
									</View>
								</View>
							</ImageBackground>
						</View>
					</View>
					<Pressable
						onPress={() => deleteFullFrame()}
						style={styles.deleteButton}
					>
						<MediumText style={styles.deleteText}>Delete frame</MediumText>
					</Pressable>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	editorWrapper: {
		backgroundColor: Colors.primary.white,
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

	formWrapper: {},
	formSection: {
		marginVertical: 5,
	},

	labelText: {
		color: Colors.primary.white,
		fontSize: 16,
		marginBottom: 3,
	},

	editorInput: {
		backgroundColor: none,
		color: Colors.primary.white,
		borderColor: Colors.primary.white,
		borderWidth: 2,
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 8,
		fontSize: 16,
	},

	editorInputDesc: {
		backgroundColor: none,
		color: Colors.primary.white,
		borderColor: Colors.primary.white,
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 10,
		fontSize: 16,
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

	deleteButton: {
		backgroundColor: Colors.primary.white,
		borderRadius: 10,
		alignItems: 'center',
		marginBottom: 150,
		marginTop: 10,
		padding: 10,
	},

	deleteText: {
		fontSize: 20,
		color: Colors.primary.pink,
		fontWeight: 'bold',
	},

	titleMockText: {
		fontSize: 20,
		color: Colors.primary.white,
	},

	creatorMockText: {
		fontSize: 16,
		color: Colors.primary.white,
		opacity: 0.75,
	},
});
