import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { BlackArrow } from './SVG/BlackArrow';
import { useUser } from '../Providers/UserProvider';
import { Colors } from '../Constants/Colors';
import { RegularText } from './Text/RegularText';

export const RoleSelect = ({ role, setRole }) => {
	const { user, setUser } = useUser();

	return (
		<View style={styles.settingItem}>
			<RegularText style={styles.labelText}>Role</RegularText>

			<Dropdown
				style={{
					width: 200,
					padding: 0,
					textAlign: 'center',
					fontSize: 14,
					height: 10,
				}}
				selectedTextStyle={{ textAlign: 'right', fontSize: 14 }}
				placeholderStyle={{ textAlign: 'right', fontSize: 14 }}
				labelField='label'
				valueField='value'
				data={[
					{ label: 'Sales', value: 'Sales' },
					{ label: 'Markerting', value: 'Markerting' },
					{ label: 'Finance', value: 'Finance' },
				]}
				placeholder='Select'
				value={role ? role : user.compagnyRole ? user.compagnyRole : 'Select'}
				itemTextStyle={{ color: Colors.primary.black }}
				onChange={
					setRole
						? (item) => {
								setRole(item);
						  }
						: (item) => {
								setUser({ ...user, compagnyRole: item });
						  }
				}
				onChangeText={
					setRole
						? (item) => {
								setRole(item);
						  }
						: (item) => {
								setUser({ ...user, compagnyRole: item });
						  }
				}
				renderRightIcon={() => (
					<BlackArrow
						style={{
							transform: [{ rotate: '90deg' }, { scale: 1.25 }],
							marginLeft: 15,
						}}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	settingItem: {
		padding: 15,
		backgroundColor: Colors.primary.white,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 18,
		marginTop: 10,

		shadowColor: '#171717',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 4,
	},
	labelText: {
		opacity: 0.5,
	},
});
