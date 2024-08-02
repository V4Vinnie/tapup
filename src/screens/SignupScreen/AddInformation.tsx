import { Text, View } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Icon from 'react-native-vector-icons/AntDesign';
import { useMemo, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';

type Props = {
	setFullName: React.Dispatch<React.SetStateAction<string>>;
	fullName: string;
	setJobType: React.Dispatch<React.SetStateAction<string>>;
	jobType: string;
	isSending: boolean;
	signUp: () => void;
};

const AddInformation = ({
	setFullName,
	fullName,
	setJobType,
	jobType,
	signUp,
	isSending,
}: Props) => {
	const { authErrors } = useAuth();

	const submitDisabled = useMemo(() => {
		return (
			fullName?.isBlank ||
			jobType?.isBlank ||
			fullName?.startsWithOrEndsWithSpaces ||
			jobType?.startsWithOrEndsWithSpaces
		);
	}, [fullName, jobType]);

	return (
		<View
			className={`w-4/5 mx-auto h-[85%] flex ${authErrors && 'h-full'}`}>
			<View>
				<Text className='text-3xl font-inter-bold text-center text-dark-textColor'>
					{'Add your information'}
				</Text>

				<Text className='text-base font-inter-medium text-center text-dark-subTextColor'>
					{'Enter further information to join the environment.'}
				</Text>

				<AppInput
					containerProps={{
						className: 'mt-6',
					}}
					leftIcon={{
						component: (
							<Icon name='user' size={16} color={'gray'} />
						),
					}}
					inputProps={{
						placeholder: 'Full name',
						value: fullName,
						keyboardType: 'default',
						onChangeText: (_fullName) => {
							setFullName(_fullName);
						},
					}}
				/>
				<AppInput
					containerProps={{
						className: 'mt-2',
					}}
					leftIcon={{
						component: (
							<Icon name='user' size={16} color={'gray'} />
						),
					}}
					inputProps={{
						placeholder: 'Job type',
						value: jobType,
						keyboardType: 'default',
						onChangeText: (_jobType) => {
							setJobType(_jobType);
						},
					}}
				/>
			</View>

			<View>
				<AppButton
					buttonProps={{
						disabled: submitDisabled || isSending,
						className: 'mt-4',
						style: {
							opacity: submitDisabled || isSending ? 0.5 : 1,
						},
					}}
					title={isSending ? 'Loading...' : 'Sign up'}
					onPress={() => {
						setFullName(fullName.trim());
						setJobType(jobType.trim());
						signUp();
					}}
				/>
				{authErrors?.information && (
					<Text
						className={`text-sm font-inter-medium text-red-500 text-center my-2 h-16`}>
						{authErrors?.information.message}
					</Text>
				)}
			</View>
		</View>
	);
};

export default AddInformation;
