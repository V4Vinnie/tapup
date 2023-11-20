import { ImageBackground, SafeAreaView, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import topBG from '../assets/DarkTop.png';
import { Back } from './Back';
import { RegularText } from './Text/RegularText';

export const PageHeader = ({
	titleName,
	navigation,
	backgroundColor,
	withBack = false,
	onBackClick,
	rightAction,
}) => (
	<SafeAreaView
		style={{
			backgroundColor: Colors.primary.bleuBottom,
			flex: 0,
			zIndex: 999,
		}}
	>
		<View
			style={{
				backgroundColor: backgroundColor
					? backgroundColor
					: Colors.primary.white,
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				zIndex: 5,
				height: 65,
			}}
		>
			<ImageBackground
				style={{
					width: '100%',
					height: '100%',
				}}
				source={topBG}
				resizeMode='cover'
			>
				<View
					style={{
						paddingHorizontal: 10,
						flexDirection: 'row',
						justifyContent: withBack ? 'space-between' : 'center',
						alignItems: 'center',
					}}
				>
					{withBack && (
						<Back
							navigate={
								onBackClick ? () => onBackClick() : () => navigation.goBack()
							}
						/>
					)}
					<RegularText
						style={{
							color: Colors.primary.white,
							textAlign: 'center',
							fontSize: 30,
							marginTop: 5,
						}}
					>
						{titleName}
					</RegularText>

					{withBack && (
						<View style={{ width: 60 }}>{rightAction && rightAction}</View>
					)}
				</View>
			</ImageBackground>
		</View>
	</SafeAreaView>
);
