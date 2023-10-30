import { FlatList, SafeAreaView, View, TextInput } from 'react-native';
import { width } from '../../utils/UseDimensoins';
import { useTaps } from '../../Providers/TapsProvider';
import { useEffect, useState } from 'react';
import { Back } from '../../Components/Back';
import { fetchTaps, fetchTopics } from '../../utils/fetch';
import { TopicRectApp } from '../../Components/TopicRectApp';
import { useUser } from '../../Providers/UserProvider';
import { Colors } from '../../Constants/Colors';

export const SearchView = ({ navigation, setTopicDetail }) => {
	const TopicWidth = width / 3;

	const { taps, setTaps } = useTaps();

	const { user } = useUser();

	const [searchValue, setSearchValeu] = useState('');
	const [filteredTopics, setFilteredTopics] = useState([]);

	const [featureTopics, setFeatureTopics] = useState([]);

	useEffect(() => {
		if (taps) {
			searchTopics(taps);
		}
	}, [searchValue]);

	useEffect(() => {
		//signOut(auth);
		const test = async () => {
			const Taps = await fetchTaps();

			const _taps = [];

			for (let i = 0; i < Taps.length; i++) {
				let tap = Taps[i];
				let _topics = await fetchTopics(tap.id);

				tap.topics = _topics;

				_taps.push(tap);
			}
			setTaps(_taps);

			let features = [];
			_taps.map(async (tap) => {
				if (tap.isFeature) {
					features.push(tap);
				}
			});
			setFeatureTopics(features);

			searchTopics(_taps);

			if (!user.watchedFrames) {
				getWatchedFrames();
			}
		};
		if (!taps) {
			test();
		}
	}, []);

	const searchTopics = (taps) => {
		let _filteredTopics = [];
		taps.map((tap) => {
			tap.topics.map((topic) => {
				if (searchValue === '') {
					_filteredTopics.push(topic);
				} else if (
					topic.title
						.toLocaleLowerCase()
						.includes(searchValue.toLocaleLowerCase())
				) {
					_filteredTopics.push(topic);
				}
			});
		});

		setFilteredTopics(_filteredTopics);
	};

	return (
		<SafeAreaView
			style={{ backgroundColor: Colors.primary.lightBleu, height: '100%' }}
		>
			<View
				style={{
					marginLeft: 10,
					marginBottom: 10,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Back navigate={() => onBackClick()} />

				<TextInput
					value={searchValue}
					onChangeText={(newText) => setSearchValeu(newText)}
					placeholder='Zoek een topic'
					style={{
						width: '70%',
						backgroundColor: Colors.primary.white,

						borderTopStartRadius: 50,
						borderBottomStartRadius: 50,
						paddingHorizontal: 10,
						paddingVertical: 15,

						alignSelf: 'flex-start',
					}}
				/>
			</View>
			<View style={{ alignItems: 'center' }}>
				<FlatList
					contentContainerStyle={{
						width: width,
						alignItems: 'flex-start',
					}}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					data={filteredTopics}
					numColumns={3}
					renderItem={({ item }) => (
						<TopicRectApp
							width={TopicWidth - 10}
							height={200}
							topic={item}
							setTopicDetail={setTopicDetail}
							navigation={navigation}
							key={item.id}
						/>
					)}
					keyExtractor={(topic) => topic.id}
				/>
			</View>
		</SafeAreaView>
	);
};
