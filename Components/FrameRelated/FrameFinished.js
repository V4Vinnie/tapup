import { Image, StyleSheet, View } from 'react-native';
import { BoldText } from '../Text/BoldText';
import { width } from '../../utils/UseDimensoins';
import { Colors } from '../../Constants/Colors';
import { RegularText } from '../Text/RegularText';
import { MediumText } from '../Text/MediumText';

export const FrameFinished = ({ newBadges, frame, creator }) => (
	<View style={styles.finishedWrapper}>
		<View style={styles.marginWrapper}>
			<View>
				<RegularText
					style={{
						fontSize: 20,
						color: Colors.primary.white,
						textAlign: 'center',
					}}
				>
					You finished
				</RegularText>
				<BoldText
					style={{
						fontSize: 45,
						color: Colors.primary.white,
						textAlign: 'center',
						lineHeight: 45,
						marginTop: 10,
					}}
				>
					{frame.title}
				</BoldText>
				<RegularText
					style={{
						fontSize: 20,
						color: Colors.primary.white,
						textAlign: 'center',
					}}
				>
					by{' '}
					<MediumText style={{ color: Colors.primary.lightBleu }}>
						{creator ? creator.name : 'unknown'}
					</MediumText>
				</RegularText>
			</View>
			{newBadges && newBadges.length > 0 ? (
				<View style={{ alignItems: 'center', marginTop: 10, }}>
					<BoldText
						style={{
							color: Colors.primary.white,
							fontSize: 20,
							textAlign: 'center',
							marginBottom: 5,
						}}
					>
						New badge earned:
					</BoldText>
					{newBadges.map((newBadge) => (
						<Image
							source={{
								uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/badges%2F${newBadge.img}?alt=media`,
							}}
							style={{ width: 160, height: 160 }}
						/>
					))}
				</View>
			) : null}
		</View>
	</View>
);

const styles = StyleSheet.create({
	finishedWrapper: {
		position: 'absolute',
		zIndex: 20,
		bottom: 0,
		left: 0,
		width: width,
		backgroundColor: 'rgba(29, 35, 58, 0.90)',
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
	},

	marginWrapper: {
		marginBottom: 70,
	},
});
