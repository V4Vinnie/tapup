import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Routes';

type Props = {
	image: Image['props']['source'];
	onPress?: () => void;
	containerProps?: View['props'];
};

const ProfilePicture = ({
	image,
	onPress,
	containerProps,
}: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	return (
		<TouchableOpacity
			onPress={onPress}
			className='items-center'
			{...containerProps}>
			<View
				className={`w-28 aspect-square mb-8 flex items-center justify-center border-2 rounded-full p-[3px] border-dark-secondaryBackground`}>
					<Image
						source={image}
						className='rounded-full w-full h-full'
					/>
			</View>
		</TouchableOpacity>
	);
};

export default ProfilePicture;
