import React, { useEffect, useMemo } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { useCompany } from '../../providers/CompanyProvider';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import AppButton from '../../components/AppButton';
import { useAuth } from '../../providers/AuthProvider';
import LoginBeforeActionModal from './LoginBeforeActionModal';

type Props = {};

const DeleteAccountButton = (props: Props) => {
	const [modalVisible, setModalVisible] = React.useState(false);
	const { handleRemoveAccount } = useAuth();

	const [showLoginModal, setShowLoginModal] = React.useState(false);

	return (
		<>
			<AppButton
				onPress={() => setModalVisible(true)}
				buttonProps={{
					className: 'w-full mt-4 bg-red-500',
				}}
				title='Delete Account'
			/>
			{/* Are you sure you want to delete modal */}
			<Modal
				avoidKeyboard
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				onBackButtonPress={() => setModalVisible(false)}>
				<View className='bg-dark-primaryBackground px-8 py-6 rounded-lg'>
					{/* title */}
					<Text className='text-xl text-white font-inter-medium'>
						{`Delete Account`}
					</Text>
					<Text className='text-base text-white mt-1'>
						{`Are you sure you want to delete your account?`}
					</Text>
					<View className='flex flex-row justify-end gap-x-12 mt-4'>
						<Pressable
							onPress={() => {
								setModalVisible(false);
								setShowLoginModal(true);
							}}
							className='mr-4'>
							<Text className='text-base text-white/60'>Yes</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								setModalVisible(false);
							}}>
							<Text className='text-base text-white'>No</Text>
						</Pressable>
					</View>
				</View>
			</Modal>

			<LoginBeforeActionModal
				title='Enter your password to delete your account'
				showLoginModal={showLoginModal}
				setShowLoginModal={setShowLoginModal}
				action={handleRemoveAccount}
			/>
		</>
	);
};

export default DeleteAccountButton;
