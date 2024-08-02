import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { mode, themeColors } from '../../utils/constants';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

type Props = {
	image: Image['props']['source'];
	containerProps?: View['props'];
	setImage: (image: string) => void;
};

const ProfilePicture = ({ image, containerProps, setImage }: Props) => {
	const [modalOpen, setModalOpen] = useState(false);

	const handleChoosePhoto = async () => {
		ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
			.then(async (result) => {
				if (result.canceled) return;
				const image = result.assets[0].uri;
				setImage(image);
				setModalOpen(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleTakePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert('Permission needed', 'Please allow camera access');
			return;
		}

		ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
			presentationStyle:
				ImagePicker.UIImagePickerPresentationStyle.OVER_FULL_SCREEN,
			preferredAssetRepresentationMode:
				ImagePicker.UIImagePickerPreferredAssetRepresentationMode
					.Compatible,
		})
			.then((result) => {
				if (result.canceled) return;
				setImage(result.assets[0].uri);
			})
			.catch((error) => {
				console.log(error);
			});

		setModalOpen(false);
	};

	return (
		<>
			<TouchableOpacity
				onPress={() => setModalOpen(true)}
				className='items-center'
				{...containerProps}>
				<View
					className={`relative w-28 aspect-square mb-8 flex items-center justify-center border-2 rounded-full p-[3px] border-dark-secondaryBackground`}>
					<Image
						source={image}
						className='absolute rounded-full w-full h-full'
					/>
					<View
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							backgroundColor:
								themeColors[mode].primaryBackground,
							borderRadius: 50,
							padding: 6,
							borderWidth: 2,
							borderColor: themeColors[mode].secondaryBackground,
						}}>
						<Icon
							name='edit'
							size={16}
							color={themeColors[mode].subTextColor}
						/>
					</View>
				</View>
			</TouchableOpacity>
			<Modal
				isVisible={modalOpen}
				onBackdropPress={() => setModalOpen(false)}
				onDismiss={() => setModalOpen(false)}
				style={{
					width: '80%',
					alignSelf: 'center',
				}}>
				<View className='rounded-lg py-8 bg-dark-primaryBackground'>
					<Text className='text-2xl font-inter-semiBold text-center text-dark-textColor mb-4'>
						{'Choose a photo'}
					</Text>
					<View className=' flex flex-row justify-center items-center gap-x-4'>
						<TouchableOpacity
							className='flex items-center w-20 p-2 rounded-lg'
							onPress={handleChoosePhoto}>
							<MaterialIcon
								name='photo-library'
								size={45}
								color={themeColors.primaryColor[100]}
							/>
							<Text className='text-xs font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
								Gallery
							</Text>
						</TouchableOpacity>
						{Platform.OS === 'android' && (
							<TouchableOpacity
								className='flex items-center w-20 p-2 rounded-lg'
								onPress={handleTakePhoto}>
								<MaterialIcon
									name='camera-alt'
									size={45}
									color={themeColors.primaryColor[100]}
								/>
								<Text className='text-xs font-inter-regular text-center text-dark-textColor leading-4 mt-2'>
									Camera
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</Modal>
		</>
	);
};

export default ProfilePicture;
