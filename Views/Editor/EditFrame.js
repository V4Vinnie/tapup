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
	Alert,
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
import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { none } from '@hookstate/core';
import { MediumText } from '../../Components/Text/MediumText';
import { PageHeader } from '../../Components/PageHeader';
import blueBG from '../../assets/bleuBG.png';
import { Dropdown } from 'react-native-element-dropdown';
import { BlackArrow } from '../../Components/SVG/BlackArrow';
import tapTopIMG from '../../assets/tapTop_pink.png';
import { Pencil } from '../../Components/SVG/Pencil';
import { RegularText } from '../../Components/Text/RegularText';
import { useEditorFrame } from '../../Providers/EditFrameProvider';

export const EditFrame = ({ navigation, removedFrameLocal }) => {
	const { user, setUser } = useUser();
	const { taps } = useTaps();
	const isFocused = useIsFocused();

	const { editorFrame, setEditorFrame } = useEditorFrame();

	const [loading, setLoading] = useState(true);

	const [isNew, setIsNew] = useState();

	const [tapTopic, setTapTopics] = useState();

	const [titleEdit, setTitleEdit] = useState(editorFrame.title);
	const [tapCategory, setTapCategory] = useState(editorFrame.tapId);
	const [topicCategory, setTopicCategory] = useState({
		id: editorFrame.topicId,
	});
	const [descriptionEdit, setDescriptionEdit] = useState(
		editorFrame.description
	);

	const [prevTap, setPrevTap] = useState(editorFrame.tapId);
	const [prevTopic, setPrevTopic] = useState(editorFrame.topicId);

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
				setEditorFrame({ ...editorFrame, contents: [..._frameContens] });
				setLoading(false);
			}
		};

		if (isFocused) {
			if (!editorFrame.isNew) {
				setIsNew(false);
				cacheContent();
			} else {
				setIsNew(true);

				setLoading(false);
			}
		}
	}, [isFocused]);

	const setTapCat = ({ id }) => {
		setTapCategory(id);
		const _topics = findById(taps, id);
		setTapTopics(_topics[0].topics);
		setTopicCategory({ id: _topics[0].topics[0].id });
	};

	const uploadThumbnail = async (thumbUrl, thumbName) => {
		const fetchimg = await fetch(thumbUrl);
		const blobImf = await fetchimg.blob();

		const storageRef = ref(storage, `frames/${editorFrame.id}/${thumbName}`);

		await uploadBytesResumable(storageRef, blobImf);
	};

	const pickCoverpic = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
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

			setThumbCover({ url: manipResult.uri, isLocal: true });
			setEditorFrame({
				...editorFrame,
				img: { url: manipResult.uri, isLocal: true },
			});
			// await uploadBytes(storageRef, blobFile).then((snapshot) => {
			// });
		}
	};

	const saveFrame = async () => {
		if (thumbCover.isLocal) {
			await uploadThumbnail(
				thumbCover.url,
				`${editorFrame.id.trim()}_thumbnail.png`
			);
		}

		const _frame = {
			added: editorFrame.added,
			contents: [...editorFrame.contents],
			creator: user.id,
			description: descriptionEdit,
			id: editorFrame.id.trim(),
			img: `${editorFrame.id.trim()}_thumbnail.png`,
			tapId: tapCategory,
			title: titleEdit,
			topicId: topicCategory.id,
		};

		await updateFrame(_frame);

		_frame.contents = editorFrame.contents;
		_frame.img = thumbCover;

		if (prevTap !== tapCategory || prevTopic !== topicCategory.id) {
			deleteFrame(prevTap, prevTopic, _frame.id);
		}
		const frameIndex = findWatchedFrameIndex(user.frames, _frame.id);

		let _frames = [...user.frames];
		_frames[frameIndex] = _frame;
		setUser({ ...user, frames: _frames });
		setEditorFrame(_frame);
		navigation.navigate('editorOverview');
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

	const removeAlert = () => {
		Alert.alert(
			'Removing frame',
			`You are about to remove ${editorFrame.title}`,
			[
				{
					text: 'Remove',
					onPress: () => deleteFullFrame(),
					style: 'destructive',
				},
				{ text: 'Keep content', onPress: () => console.log('OK Pressed') },
			]
		);
	};

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<PageHeader
				titleName={'Frame info'}
				backgroundColor={Colors.primary.lightBleu}
				withBack
				navigation={navigation}
				onBackClick={async () => {
					if (
						editorFrame.isNew &&
						titleEdit.trim() !== '' &&
						typeof tapCategory !== 'string' &&
						typeof topicCategory !== 'string' &&
						thumbCover
					) {
						await saveFrame();
					} else {
						await saveFrame();
					}
				}}
				rightAction={
					<TouchableOpacity
						style={{ justifyContent: 'center', alignItems: 'center' }}
						onPress={() => navigation.navigate('editContent')}
					>
						<RegularText style={{ color: Colors.primary.white, fontSize: 14 }}>
							Content
						</RegularText>
					</TouchableOpacity>
				}
			/>
			<SafeAreaView style={styles.editorWrapper}>
				<ScrollView
					style={styles.formWrapper}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
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
								onChange={(tapId) => {
									setTapCat(tapId);
								}}
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
					<Pressable onPress={() => removeAlert()} style={styles.deleteButton}>
						<RegularText style={styles.deleteText}>Delete frame</RegularText>
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
		marginBottom: height / 3,
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
