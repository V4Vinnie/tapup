import React, { useEffect, useMemo } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { useCompany } from '../../providers/CompanyProvider';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

type Props = {
	icon: React.ReactNode;
	title: string;
	value: string | undefined;
	onDelete: () => void;
	onAdd: () => void;
	description?: string;
	noValueText?: string;
};

const DeleteOrAddSetting = ({
	icon,
	title,
	value,
	onDelete,
	onAdd,
	description,
	noValueText = '',
}: Props) => {
	const { companyColor } = useCompany();
	const [modalVisible, setModalVisible] = React.useState(false);

	const deleteIcon = useMemo(
		() => <FontAwesome6 name='trash-can' size={18} color={companyColor} />,
		[companyColor]
	);
	const addIcon = useMemo(
		() => (
			<MaterialIcons
				name='add-circle-outline'
				size={20}
				color={companyColor}
			/>
		),
		[companyColor]
	);

	const [rightIcon, setRightIcon] =
		React.useState<React.ReactNode>(deleteIcon);

	useEffect(() => {
		if (value) {
			setRightIcon(deleteIcon);
		} else {
			setRightIcon(addIcon);
		}
	}, [value, companyColor]);

	return (
		<>
			<Pressable
				onPress={() => {
					if (value) {
						setModalVisible(true);
					} else {
						onAdd();
					}
				}}
				className='flex flex-row justify-between items-center mb-8'>
				<View className='mr-6'>{icon}</View>
				<View className='flex flex-col gap-1 flex-1'>
					<View className='flex flex-row justify-between items-center'>
						<View className='flex flex-col w-fit'>
							<Text className='text-dark-textColor/60 text-sm font-inter-regular'>
								{title}
							</Text>
							<Text className='text-dark-textColor text-sm font-inter-medium'>
								{value ?? noValueText}
							</Text>
						</View>
						{rightIcon}
					</View>
					{description && (
						<Text className='text-dark-textColor/50 text-xs font-inter-regular'>
							{description}
						</Text>
					)}
				</View>
			</Pressable>
			{/* Are you sure you want to delete modal */}
			<Modal
				avoidKeyboard
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				onBackButtonPress={() => setModalVisible(false)}>
				<View className='bg-dark-primaryBackground px-8 py-6 rounded-lg'>
					<Text className='text-lg text-white'>
						{`Are you sure you want to delete this?`}
					</Text>
					<View className='flex flex-row justify-end gap-x-12 mt-4'>
						<Pressable
							onPress={() => {
								setModalVisible(false);
								onDelete();
							}}
							className='mr-4'>
							<Text className='text-base text-white'>Yes</Text>
						</Pressable>
						<Pressable
							onPress={() => {
								setModalVisible(false);
							}}>
							<Text
								className='text-base'
								style={{ color: companyColor }}>
								No
							</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</>
	);
};

export default DeleteOrAddSetting;
