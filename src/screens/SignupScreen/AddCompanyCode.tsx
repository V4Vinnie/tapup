import { Text, View } from 'react-native';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import Icon from 'react-native-vector-icons/AntDesign';
import Swiper from 'react-native-swiper';
import { useEffect, useState } from 'react';
import { searchCompany } from '../../database/services/UserService';
import { TCompany } from '../../types';
import { useCompany } from '../../providers/CompanyProvider';
import { primaryColor } from '../../utils/constants';

type Props = {
	setCompany: React.Dispatch<React.SetStateAction<TCompany | undefined>>;
	swiper: React.RefObject<Swiper>;
};

const AddCompanyCode = ({ setCompany: setCompany, swiper }: Props) => {
	const { setCompanyColor, companyColor } = useCompany();
	const [code, setCode] = useState<string | undefined>();
	const [foundCompany, setFoundCompany] = useState<TCompany | null>(null);

	useEffect(() => {
		if (code?.length === 6) {
			searchCompany(code).then((company) => {
				setFoundCompany(company);
				if (!company) return;
				setCompany(company);
				setCompanyColor(company.primaryColor);
			});
		}
	}, [code]);

	useEffect(() => {
		if (!foundCompany) {
			setCompany(undefined);
			setCompanyColor(primaryColor);
		}
	}, [foundCompany]);

	return (
		<View className='w-4/5 mx-auto h-[85%] overflow-hidden flex justify-between'>
			<View>
				<Text className='text-3xl font-inter-bold text-center text-dark-textColor'>
					{'Add company code'}
				</Text>

				<Text className='text-base font-inter-medium text-center text-dark-subTextColor'>
					{'Enter the company code to join the environment.'}
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
						placeholder: 'Company code',
						value: code,
						keyboardType: 'numeric',
						onChangeText: (_code) => {
							setCode(_code);
						},
					}}
				/>

				{foundCompany && (
					<View className='flex-row items-center justify-center mt-4'>
						<Icon name='check' size={16} color={'green'} />
						<Text className='text-base font-inter-medium text-dark-textColor ml-2'>
							{'Company found: '}
						</Text>
						<Text
							className='text-base'
							style={{ color: companyColor }}>
							{foundCompany.name}
						</Text>
					</View>
				)}
			</View>

			<AppButton
				buttonProps={{
					disabled: !foundCompany,
					className: 'mt-4',
					style: {
						opacity: !foundCompany ? 0.5 : 1,
					},
				}}
				title={'Next'}
				onPress={() => swiper.current?.scrollBy(1)}
			/>
		</View>
	);
};

export default AddCompanyCode;
