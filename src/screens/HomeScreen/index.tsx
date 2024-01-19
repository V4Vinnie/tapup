import React, { useEffect } from 'react';
import { Animated, SafeAreaView, ScrollView, Text, View } from 'react-native';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from '../../navigation/Routes';
import SectionHeader from '../../components/SectionHeader';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import TapRow from '../../components/TapRow';
import { useTaps } from '../../providers/TapProvider';
import { InstagramStoryProps } from '@birdwingo/react-native-instagram-stories/src/core/dto/instagramStoriesDTO';
import CustomStory from '../../components/Custom/CustomStory';
import { mode, themeColors } from '../../utils/constants';

type Props = {};

const HomeScreen = (props: Props) => {
	const { navigate } =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { taps } = useTaps();

	const scrollY = new Animated.Value(0);
	const diffClamp = Animated.diffClamp(scrollY, 0, 130);
	const translateY = diffClamp.interpolate({
		inputRange: [0, 130],
		outputRange: [0, -130],
	});

	const stories: InstagramStoryProps[] = [
		{
			id: 'user1',
			name: 'User 1',
			imgUrl: 'https://picsum.photos/200/300',
			stories: [
				{
					id: 'story1',
					sourceUrl: 'https://picsum.photos/720/1080',
					mediaType: 'image',
				},
				{
					id: 'story2',
					sourceUrl: 'https://picsum.photos/720/1080',
					mediaType: 'image',
				},
				{
					id: 'story3',
					sourceUrl: 'https://picsum.photos/720/1080',
					mediaType: 'image',
				},
			],
		},
	];

	return (
		<SafeAreaView className='flex-1 items-center bg-dark-primaryBackground'>
			<FocusAwareStatusBar translucent barStyle={'light-content'} />
			<View className='flex w-11/12 mt-8'>
				<SearchBar
					containerProps={{
						style: {
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 100,
							transform: [{ translateY: translateY }],
						},
					}}
					onPress={() => navigate(Routes.SEARCH_SCREEN)}
				/>
				<ScrollView
					className='w-full mt-6'
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'center',
					}}
					showsVerticalScrollIndicator={false}
					onScroll={(e) => {
						scrollY.setValue(e.nativeEvent.contentOffset.y);
					}}>
					<View className='w-full mt-8'>
						<SectionHeader
							title='Continue watching'
							onPress={() =>
								navigate(Routes.GENERAL_SEE_MORE, {
									title: 'Continue watching',
									data: taps,
								})
							}
						/>
						<TapRow tapData={taps} />
						<CustomStory
							backgroundColor={
								themeColors[mode].primaryBackground
							}
							textStyle={{
								color: themeColors[mode].textColor,
							}}
							modalAnimationDuration={400}
							animationDuration={3000}
							closeIconColor='white'
							stories={stories}
							progressColor={
								themeColors[mode].secondaryBackground
							}
							progressActiveColor={themeColors.primaryColor[100]}
							containerStyle={{
								height: '100%',
							}}
							saveProgress={true}
							storyAvatarSize={30}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
