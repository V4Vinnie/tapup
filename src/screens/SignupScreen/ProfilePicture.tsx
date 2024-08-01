import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { mode, themeColors } from '../../utils/constants';
import { darkMode } from '../../../tailwind.config';

type Props = {
	image: Image['props']['source'];
	onPress?: () => void;
	containerProps?: View['props'];
};

const ProfilePicture = ({ image, onPress, containerProps }: Props) => {
	return (
		<TouchableOpacity
			onPress={onPress}
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
						backgroundColor: themeColors[mode].primaryBackground,
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
	);
};

export default ProfilePicture;
