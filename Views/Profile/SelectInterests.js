import { Fragment } from 'react';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import { ImageBackground, View } from 'react-native';
import blueBG from '../../assets/bleuBG.png';
import { useTaps } from '../../Providers/TapsProvider';
import { Pill } from '../../Components/Pill';
import { IntrestPill } from './IntrestPill';
import { useUser } from '../../Providers/UserProvider';
import { updateUser } from '../../utils/fetch';
import { InterestPills } from '../../Components/InterestPills';

export const SelectInterests = ({ navigation }) => {
	const { taps } = useTaps();

	const { user, setUser } = useUser();

	const clickTopic = (tap) => {
		let _selectedTopics = [...user.selectedTopics];
		if (user.selectedTopics.includes(tap.id)) {
			const _newSelectedTopics = _selectedTopics.filter((id) => id !== tap.id);
			setUser({ ...user, selectedTopics: _newSelectedTopics });
		} else {
			_selectedTopics.push(tap.id);
			setUser({ ...user, selectedTopics: _selectedTopics });
		}
	};

	const saveOnBack = () => {
		updateUser(user);
		navigation.goBack();
	};

	return (
		<Fragment>
			<PageHeader
				titleName={'Interests'}
				navigation={navigation}
				backgroundColor={Colors.primary.lightBleu}
				withBack
				onBackClick={saveOnBack}
			/>
			<ImageBackground
				source={blueBG}
				imageStyle={{ height: 530, top: -150, zIndex: -10 }}
				style={{ padding: 10 }}
			>
				<InterestPills
					clickTopic={clickTopic}
					selectedTopics={user.selectedTopics}
				/>
			</ImageBackground>
		</Fragment>
	);
};
