import { View, Text } from 'react-native';
import { mode, themeColors } from '../utils/constants';
import PrimaryGradient from './PrimaryGradient';
import { useCompany } from '../providers/CompanyProvider';

type Props = {
	active?: boolean;
};

const CustomSwiperDot = ({ active = false }: Props) => {
	const { isCompanyColorSet, companyColor } = useCompany();

	return (
		<PrimaryGradient
			companyColor={isCompanyColorSet ? companyColor : undefined}
			className='w-2 h-2 rounded-full mx-1 my-1'>
			{!active && (
				<View
					style={{
						borderRadius: 4,
						flex: 1,
						margin: 1,
						backgroundColor: themeColors[mode].primaryBackground,
					}}
				/>
			)}
		</PrimaryGradient>
	);
};

export default CustomSwiperDot;
