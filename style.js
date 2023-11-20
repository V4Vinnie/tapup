import { Colors } from './Constants/Colors';
import { width } from './utils/UseDimensoins';

export const bodyText = { color: Colors.primary.white, fontSize: 24 };

export const buttonStyle = {
	backgroundColor: Colors.primary.pink,
	paddingVertical: 10,
	paddingHorizontal: 20,
	borderRadius: 20,
	alignItems: 'center',
};

export const containerStyle = {
	flex: 1,
	backgroundColor: Colors.primary.bleuBottom,
	color: Colors.primary.white,
	alignItems: 'center',
};

export const titleStyle = {
	fontSize: 48,
	color: Colors.primary.white,
	fontFamily: 'DMSans-Bold',
};

export const sectionTitle = {
	fontSize: 24,
	color: Colors.primary.white,
	marginBottom: 8,
	marginTop: 15,
	maxWidth: width / 2 - 10,
	fontFamily: 'DMSans-Medium',
};

export const shadowProp = {
	shadowColor: 'rgba(0, 0, 0, 0.25)',
	shadowOffset: { width: 0, height: 0 },
	shadowOpacity: 0.2,
	shadowRadius: 2,
};
