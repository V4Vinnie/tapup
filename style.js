import { Colors } from './Constants/Colors';
import { width } from './utils/UseDimensoins';

export const bodyText = { color: Colors.primary.white, fontSize: 24 };

export const buttonStyle = {
	backgroundColor: Colors.primary.pink,
	paddingVertical: 24,
	paddingHorizontal: 127,
	borderRadius: 18,
};

export const containerStyle = {
	flex: 1,
	backgroundColor: Colors.primary.bleuBottom,
	color: Colors.primary.white,
	alignItems: 'center',
	justifyContent: 'space-evenly',
};

export const titleStyle = {
	fontSize: 48,
	fontWeight: 'bold',
	color: Colors.primary.white,
};

export const sectionTitle = {
	fontSize: 24,
	color: Colors.primary.white,
	marginBottom: 8,
	maxWidth: width / 2 - 10,
};

export const shadowProp = {
	shadowColor: '#171717',
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.8,
	shadowRadius: 3,
};
