import { Video } from 'expo-av';
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import {
	ImageBackground,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Back } from '../../Components/Back';
import { height, width } from '../../utils/UseDimensoins';
import { DragText } from './DragText';
import uuid from 'uuid';
import { Colors } from '../../Constants/Colors';
import { storage } from '../../firebaseConfig';

export const EditContent = ({
	editorContent,
	setEditContent,
	editorFrame,
	editContent,
	setEditorContent,
}) => {
	const snapRef = useRef();

	const [isTextEditing, setIsTextEditing] = useState(false);
	const [textRefs, setTextRefs] = useState([]);

	const [imageText, setImageText] = useState(
		editContent ? editContent.textContent : []
	);

	useEffect(() => {
		if (editContent && editContent.textContent) {
			setImageText(editContent.textContent);
		} else {
			setImageText([]);
		}


	}, [editContent]);

	const addImageText = () => {
		if (!isTextEditing) {
			setImageText([
				...imageText,
				{
					x: width / 2 - 50,
					y: height / 2 - 120,
					text: 'New text',
					id: uuid.v4(),
					created: true,
				},
			]);
		}
	};

	const updateImageText = (value, index) => {
		const _imageText = imageText;
		_imageText[index] = { ..._imageText[index], ...value };

		setImageText([..._imageText]);
	};

	// const uploadThumbnail = async (thumbUri, thumbName) => {
	// 	const response = await fetch(`file://${thumbUri}`);
	// 	const blobFile = await response.blob();

	// 	console.log('MADE BLOB', blobFile);

	// 	const storageRef = ref(
	// 		storage,
	// 		`frames/${editorFrame.id}/${thumbName}.png`
	// 	);

	// 	await uploadBytes(storageRef, blobFile);
	// };

	const uploadThumbnail = async (thumbBlob, thumbName) => {
		const storageRef = ref(storage, `frames/${editorFrame.id}/${thumbName}`);

		await uploadBytes(storageRef, thumbBlob);
	};

	const saveEditFrame = async () => {
		const thumbUri = await snapRef.current.capture();

		const contentInd = [...editorContent]
			.map((e) => e.contentUrl)
			.indexOf(editContent.contentUrl);
		let _content = [...editorContent];

		const thumbFetch = await fetch(thumbUri);
		const thumbBlob = await thumbFetch.blob();

		await uploadThumbnail(thumbBlob, `${editContent.thumbnail}.png`);

		_content[contentInd].textContent = imageText;
		_content[contentInd].thumbnailUrl = thumbUri;

		setEditorContent(_content);
		setIsTextEditing(false);
		setEditContent();
		setImageText([]);
	};

	return (
		<>
			<View style={styles.navHeading}>
				<Back
					navigate={() => {
						// setImageText([]);
						setIsTextEditing(false);
						setEditContent(undefined);
					}}
				/>
				<Pressable onPress={() => saveEditFrame()}>
					<Text style={styles.saveText}>Save</Text>
				</Pressable>
			</View>

			{editContent.type === 'video' ? (
				<ViewShot
					ref={snapRef}
					style={{ zIndex: 0, backgroundColor: Colors.primary.bleuBottom }}
					options={{
						fileName: editContent.content,
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
							uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${editorFrame.id}%2F${editContent.thumbnail}.png?alt=media`,
						}}
					>
						<Video
							source={{ uri: editContent.contentUrl }}
							style={{
								...styles.backgroundVideo,
								background: { uri: editContent.thumbnail },
							}}
							resizeMode={'cover'}
							useNativeControls={false}
							shouldPlay={true}
						>
							<SafeAreaView
								style={{ width: width, height: height, zIndex: 450 }}
							>
								<Pressable
									onPress={() => addImageText(isTextEditing)}
									style={{ width: width, height: height, zIndex: 450 }}
									disabled={isTextEditing}
								>
									{imageText &&
										imageText.map((item, index) => (
											<DragText
												item={item}
												index={index}
												changeText={updateImageText}
												updateTextEdit={setIsTextEditing}
												textRefs={textRefs}
												setTextRefs={setTextRefs}
											/>
										))}
								</Pressable>
							</SafeAreaView>
						</Video>
					</ImageBackground>
				</ViewShot>
			) : (
				<ViewShot
					ref={snapRef}
					style={{ zIndex: 0, backgroundColor: Colors.primary.bleuBottom }}
					options={{
						fileName: editContent.content,
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
						source={{ uri: editContent.contentUrl }}
					>
						<SafeAreaView>
							<Pressable
								onPress={() => addImageText(isTextEditing)}
								style={{ width: '100%', height: '100%' }}
								disabled={isTextEditing}
							>
								{imageText &&
									imageText.map((item, index) => (
										<DragText
											item={item}
											index={index}
											changeText={updateImageText}
											updateTextEdit={setIsTextEditing}
											textRefs={textRefs}
											setTextRefs={setTextRefs}
										/>
									))}
							</Pressable>
						</SafeAreaView>
					</ImageBackground>
				</ViewShot>
			)}
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
});
