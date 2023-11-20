import { Video } from 'expo-av';
import { deleteObject, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import {
	Alert,
	ImageBackground,
	Pressable,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Back } from '../../Components/Back';
import { height, width } from '../../utils/UseDimensoins';
import { Colors } from '../../Constants/Colors';
import { storage } from '../../firebaseConfig';
import { MediumText } from '../../Components/Text/MediumText';
import { useSetNavBar } from '../../Providers/ShowNavBarProvider';
import { NextPrevIcon } from '../../Components/SVG/NextPrevIcon';
import { AddContentIcon } from '../../Components/SVG/AddContentIcon';
import { Tool, VESDK } from 'react-native-videoeditorsdk';
import { PESDK } from 'react-native-photoeditorsdk';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { compressVideo } from '../../utils/videoCompress';
import { updateFrame } from '../../utils/fetch';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { BoldText } from '../../Components/Text/BoldText';
import { useIsFocused } from '@react-navigation/native';
import { getVideoDuration } from '@qeepsake/react-native-file-utils';
import { useEditorFrame } from '../../Providers/EditFrameProvider';

export const EditContent = ({ navigation }) => {
	const snapRef = useRef();
	const { editorFrame, setEditorFrame } = useEditorFrame();
	const [editContentInd, setEditContentInd] = useState(0);

	const { setShowNavBar } = useSetNavBar();

	const [oldContent, setOldContent] = useState();

	const isFocused = useIsFocused();

	useEffect(() => {
		setShowNavBar(false);
		setOldContent([...editorFrame.contents]);
	}, [isFocused]);

	const uploadContent = async (contentUrl) => {
		const contentFetch = await fetch(contentUrl);
		const contentBlob = await contentFetch.blob();

		const storageRef = ref(
			storage,
			`frames/${editorFrame.id}/${editorFrame.contents[editContentInd].content}`
		);

		await uploadBytesResumable(storageRef, contentBlob);
	};

	const showEditor = async (contentURL) => {
		try {
			// Open the video editor and handle the export as well as any occuring errors.
			let result;

			const configuration = {
				tools: [
					Tool.TEXT,
					Tool.STICKER,
					Tool.TRANSFORM,
					Tool.COMPOSITION,
					Tool.ADJUSTMENT,
					Tool.AUDIO,
					Tool.FILTER,
				],
			};
			if (editorFrame.contents[editContentInd].type === 'video') {
				setStartVideo(false);

				result = await VESDK.openEditor(contentURL, configuration);

				if (result != null) {
					const manipResult = await compressVideo(result.video);

					const durationMs = await getVideoDuration(manipResult);

					const newDuartion = durationMs * 1000;

					await uploadContent(manipResult);

					const _editorContent = [...editorFrame.contents];

					_editorContent[editContentInd].contentUrl = manipResult;
					_editorContent[editContentInd].time = newDuartion;

					setEditorFrame({ ...editorFrame, contents: _editorContent });

					setStartVideo(true);
				} else {
					// The user tapped on the cancel button within the editor.
					setStartVideo(true);
					return;
				}
			} else {
				result = await PESDK.openEditor(contentURL, configuration);

				if (result != null) {
					const manipResult = await manipulateAsync(result.image, [], {
						compress: 0.3,
						format: SaveFormat.PNG,
					});

					const _editorContent = [...editorFrame.contents];

					_editorContent[editContentInd].contentUrl = manipResult.uri;

					await uploadContent(manipResult.uri);
					setEditorFrame({ ...editorFrame, contents: _editorContent });
				} else {
					// The user tapped on the cancel button within the editor.
					return;
				}
			}
		} catch (error) {
			// There was an error generating the video.
			console.log(`ERR`, error);
		}
	};

	const removeContent = async () => {
		const oldFrameContent = editorFrame.contents[editContentInd].content;
		let _content = [...editorFrame.contents];
		_content.splice(editContentInd, 1);

		setEditContentInd(editContentInd - 1);

		setEditorFrame({
			...editorFrame,
			contents: _content,
		});

		await updateFrame({
			...editorFrame,
			contents: _content,
		});

		const deleteRef = ref(
			storage,
			`frames/${editorFrame.id}/${oldFrameContent}`
		);
		deleteObject(deleteRef);
	};

	const removeAlert = () => {
		Alert.alert(
			'Removing content',
			'You are about to remove this piece of content',
			[
				{
					text: 'Remove',
					onPress: () => removeContent(),
					style: 'destructive',
				},
				{ text: 'Keep content', onPress: () => console.log('OK Pressed') },
			]
		);
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

	const addFrameContent = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			quality: 1,
		});

		if (!result.canceled) {
			if (result.assets[0].duration === null) {
				const manipResult = await manipulateAsync(result.assets[0].uri, [], {
					compress: 0.3,
					format: SaveFormat.PNG,
				});
				const contentFetch = await fetch(manipResult.uri);
				const contentBlob = await contentFetch.blob();

				const id = uuid.v4();
				const newImg = {
					content: `${id}.png`,
					contentUrl: manipResult.uri,
					thumbnail: `thumbnail_${id}`,
					thumbnailUrl: manipResult.uri,
					type: 'image',
					time: 10000,
					isNew: true,
					isDeleted: false,
				};

				const uploadRef = ref(
					storage,
					`frames/${editorFrame.id}/${newImg.content}`
				);

				await uploadBytesResumable(uploadRef, contentBlob);

				setEditorFrame({
					...editorFrame,
					contents: [...editorFrame.contents, newImg],
				});

				setEditContentInd(editContentInd + 1);

				await updateFrame({
					...editorFrame,
					contents: [...editorFrame.contents, newImg],
				});
			} else {
				const thumb = await generateThumbnail(result.assets[0].uri);
				const id = uuid.v4();

				const compresedVideo = await compressVideo(result.assets[0].uri);

				const newVid = {
					content: `${id}.mp4`,
					contentUrl: compresedVideo,
					type: 'video',
					time: result.assets[0].duration,
					thumbnail: thumb,
					isNew: true,
					isDeleted: false,
				};

				const uploadRef = ref(
					storage,
					`frames/${editorFrame.id}/${newVid.content}`
				);

				const contentFetch = await fetch(compresedVideo);
				const contentBlob = await contentFetch.blob();

				await uploadBytesResumable(uploadRef, contentBlob);

				setEditorFrame({
					...editorFrame,
					contents: [...editorFrame.contents, newVid],
				});

				setEditContentInd(editContentInd + 1);

				await updateFrame({
					...editorFrame,
					contents: [...editorFrame.contents, newVid],
				});
			}
		}
	};

	const [startVideo, setStartVideo] = useState(false);

	return (
		<>
			<View style={styles.navHeading}>
				<Back
					navigate={() => {
						setShowNavBar(true);
						navigation.goBack();
					}}
				/>
				<Pressable onPress={() => removeAlert()}>
					<MediumText style={styles.saveText}>Remove</MediumText>
				</Pressable>
			</View>
			{(editorFrame.isNew && editorFrame.contents.length === 0) ||
			editorFrame.contents.length === 0 ? (
				<View
					style={{
						width: width,
						height: height,
						backgroundColor: Colors.primary.bleuBottom,
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 20,
					}}
				>
					<BoldText
						style={{
							fontSize: 50,
							textAlign: 'center',
							color: Colors.primary.white,
							opacity: 0.5,
						}}
					>
						Add content via the plus icon
					</BoldText>
					<TouchableOpacity onPress={() => addFrameContent()}>
						<AddContentIcon />
					</TouchableOpacity>
				</View>
			) : (
				<>
					{editorFrame.contents[editContentInd]?.type === 'video' ? (
						<ViewShot
							ref={snapRef}
							style={{ zIndex: 0, backgroundColor: Colors.primary.bleuBottom }}
							options={{
								fileName: editorFrame.contents[editContentInd].content,
								format: 'png',
								quality: 0.1,
								width: width / 2,
								height: height / 2,
							}}
						>
							<ImageBackground
								style={{
									width: width,
									height: height,
									backgroundColor: Colors.primary.bleuBottom,
								}}
								source={{
									uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${editorFrame.contents[editContentInd].thumbnail}?alt=media`,
								}}
							>
								<Video
									source={{
										uri: editorFrame.contents[editContentInd].contentUrl,
									}}
									style={{
										...styles.backgroundVideo,
										background: {
											uri: editorFrame.contents[editContentInd].thumbnail,
										},
									}}
									resizeMode={'cover'}
									useNativeControls={false}
									shouldPlay={startVideo}
									onReadyForDisplay={() => setStartVideo(true)}
									isLooping={true}
								></Video>
							</ImageBackground>
						</ViewShot>
					) : (
						<ViewShot
							ref={snapRef}
							style={{ zIndex: 0, backgroundColor: Colors.primary.bleuBottom }}
							options={{
								fileName: editorFrame.contents[editContentInd]?.content,
								format: 'png',
								quality: 0.2,
								width: width,
								height: height,
							}}
						>
							<ImageBackground
								imageStyle={{
									backgroundColor: Colors.primary.pink,
								}}
								style={{
									width: width,
									height: height,
								}}
								source={{
									uri: editorFrame.contents[editContentInd]?.contentUrl,
								}}
							></ImageBackground>
						</ViewShot>
					)}
				</>
			)}

			<View
				style={{
					position: 'absolute',
					bottom: 50,
					paddingHorizontal: 20,
					flexDirection: 'row',
					width: '100%',
					justifyContent: 'space-between',
				}}
			>
				<TouchableOpacity
					onPress={() => {
						if (editContentInd > 0) {
							setEditContentInd(editContentInd - 1);
						}
					}}
				>
					<NextPrevIcon />
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.editButton}
					onPress={() => {
						showEditor(editorFrame.contents[editContentInd]?.contentUrl);
					}}
				>
					<MediumText style={{ color: Colors.primary.white }}>Edit</MediumText>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						if (editContentInd < editorFrame.contents.length - 1) {
							setEditContentInd(editContentInd + 1);
						} else {
							addFrameContent();
						}
					}}
				>
					{editContentInd === editorFrame.contents.length - 1 ||
					editorFrame.isNew ? (
						<AddContentIcon />
					) : (
						<NextPrevIcon style={{ transform: [{ rotate: '180deg' }] }} />
					)}
				</TouchableOpacity>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	saveText: {
		color: Colors.primary.white,
		fontSize: 20,
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

	editButton: {
		padding: 10,
		backgroundColor: Colors.primary.pink,
		width: width / 3 + 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
});
