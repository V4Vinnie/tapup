import React, { useMemo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCompany } from '../../providers/CompanyProvider';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import Modal from 'react-native-modal';
import AppInput from '../../components/AppInput';
import { mode, themeColors } from '../../utils/constants';

type Props = {
	icon: React.ReactNode;
	title: string;
	value: string;
	onChange: (value: string) => void;
	description?: string;
	maxChars: number;
};

const ChangeSetting = ({
	icon,
	title,
	value,
	onChange,
	description,
	maxChars,
}: Props) => {
	const { companyColor } = useCompany();
	const [modalVisible, setModalVisible] = React.useState(false);
	const [newValue, setNewValue] = React.useState(value);
	const inputRef = React.useRef<TextInput>(null);

	const charsLeft = useMemo(() => {
		return `${maxChars - newValue.length}`;
	}, [newValue]);

	return (
		<>
			<TouchableOpacity
				onPress={() => {
					setModalVisible(true);
					setTimeout(() => inputRef.current?.focus(), 500);
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
								{value}
							</Text>
						</View>
						<FoundationIcon
							name='pencil'
							size={20}
							color={companyColor}
						/>
					</View>
					{description && (
						<Text className='text-dark-textColor/50 text-xs font-inter-regular'>
							{description}
						</Text>
					)}
				</View>
			</TouchableOpacity>
			<Modal
				isVisible={modalVisible}
				onBackdropPress={() => setModalVisible(false)}
				onDismiss={() => setModalVisible(false)}>
				<View className='rounded-lg px-8 py-6 bg-dark-primaryBackground'>
					<Text className='text-xl font-inter-semiBold text-dark-textColor mb-4'>
						{'Change ' + title}
					</Text>
					<View className='relative'>
						<TextInput
							maxLength={maxChars}
							ref={inputRef}
							value={newValue}
							onChangeText={setNewValue}
							placeholder={title}
							className='bg-transparent border-b-[1px] border-dark-textColor/80 text-dark-textColor mb-4 font-inter-regular text-base'
							placeholderTextColor={
								themeColors[mode].subTextColor
							}
							style={{
								borderColor: companyColor,
							}}
							autoCapitalize='none'
						/>
						<Text className='absolute right-0 bottom-5 text-dark-textColor/50 text-xs font-inter-regular'>
							{charsLeft}
						</Text>
					</View>

					<View className='flex flex-row justify-end items-center gap-x-12 mt-4'>
						<TouchableOpacity
							className=''
							onPress={() => setModalVisible(false)}>
							<Text className='text-sm font-inter-regular text-center text-dark-textColor leading-4 tracking-wider'>
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className='flex items-center rounded-full'
							onPress={() => {
								setModalVisible(false);
								onChange(newValue);
							}}>
							<Text
								className='text-sm font-inter-regular text-center leading-4'
								style={{
									color: companyColor,
								}}>
								Save
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

export default ChangeSetting;
