import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-new-snap-carousel';
import { Colors } from '../Constants/Colors';
import { useUser } from '../Providers/UserProvider';
import { cacheImages, cacheVideo } from '../utils/downloadAssets';
import { updateUser, updateWatchedFrames } from '../utils/fetch';
import { findById, findWatchedFrameIndex } from '../utils/findById';
import { height, width } from '../utils/UseDimensoins';
import { Back } from './Back';
import { Frame } from './Frame';
import { FramePogress } from './FrameProgress';
import { Loading } from './Loading';

export const Frames = ({ navigation, frame }) => {
	const [carRef, setCarRef] = useState();
	const { user, setUser } = useUser();

	const [activeFrame, setActiveFrame] = useState(0);

	const [showTime, setShowTime] = useState(frame.contents[0].time);

	const [isLoading, setIsLoading] = useState(true);

	const [frameContents, setFrameContents] = useState([]);

	const goNext = () => {
		if (activeFrame + 1 === frameContents.length) {
			return;
		} else {
			const newFrame = activeFrame + 1;
			setActiveFrame(newFrame);
			setShowTime(frameContents[newFrame].time);
		}
	};

	const goPrev = () => {
		if (activeFrame === 0) {
			return;
		} else {
			const newFrame = activeFrame - 1;
			setActiveFrame(newFrame);
			setShowTime(frameContents[newFrame].time);
		}
	};

	useEffect(() => {
		const cacheContent = async () => {
			setIsLoading(true);
			let _frameContens = frame.contents;
			let imgs = [];
			let videos = [];
			_frameContens.map((_content) => {
				const contentURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${frame.id}%2F${_content.content}?alt=media`;

				if (_content.type === 'image') {
					imgs.push(contentURL);
				} else if (_content.type === 'video') {
					videos.push(contentURL);
				}
			});
			try {
				const downloaded = await Promise.all([
					...cacheVideo(videos),
					...cacheImages(imgs),
				]);

				for (let index = 0; index < _frameContens.length; index++) {
					_frameContens[index].content = downloaded[index].localUri;
				}
			} catch (e) {
			} finally {
				const _watched = findById(user.watchedFrames, frame.id);
				if (_watched[0]) {
					setActiveFrame(_watched[0].watchedContentIndex);
				}
				setFrameContents(_frameContens);
				setShowTime(_frameContens[0].time);
				setIsLoading(false);
			}
		};

		cacheContent();
	}, [frame]);

	const countInterval = useRef(null);

	useEffect(() => {
		if (!isLoading) {
			if (countInterval) {
				clearTimeout(countInterval);
			}
			countInterval.current = setTimeout(() => {
				goNext();
			}, showTime);
		}
	}, [showTime, isLoading]);

	const saveGoBack = async () => {
		const checkIsDone = () => {
			if (activeFrame + 1 === frameContents.length) {
				return true;
			} else {
				return false;
			}
		};

		const frameData = {
			id: frame.id,
			isDone: checkIsDone(),
			topicId: frame.topicId,
			watchedContentIndex: activeFrame,
		};

		const watchIndx = await findWatchedFrameIndex(user.watchedFrames, frame.id);

		let allWatched = user.watchedFrames;

		if (watchIndx >= 0) {
			allWatched[watchIndx] = frameData;
		} else {
			allWatched = [...user.watchedFrames, frameData];
		}
		let isInSelected = false;
		for (let i = 0; i < user.selectedTopics.length; i++) {
			const element = user.selectedTopics[i];
			if (element === frame.topicId) {
				isInSelected = true;
			}
		}
		let selected = [...user.selectedTopics];
		if (!isInSelected) {
			selected = [...user.selectedTopics, frame.topicId];
		}

		setUser({ ...user, selectedTopics: selected, watchedFrames: allWatched });
		updateWatchedFrames(user.id, frameData);
		let _user = user;
		delete _user.watchedFrames;
		updateUser(_user);
		navigation.goBack();
	};

	if (!isLoading) {
		return (
			<>
				<SafeAreaView
					style={{
						position: 'absolute',
						zIndex: 10,
						width: width - 30,
						marginLeft: 15,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'start',
					}}
				>
					<Back navigate={() => saveGoBack()} />
					<Text
						style={{
							fontSize: 24,
							textAlign: 'right',
							color: Colors.primary.white,
							maxWidth: (width / 4) * 3,
						}}
					>
						{frame.title}
					</Text>
				</SafeAreaView>
				<Frame
					item={frameContents[activeFrame]}
					index={activeFrame}
					goNext={goNext}
					goPrev={goPrev}
				/>

				<FramePogress
					length={frameContents.length}
					time={showTime}
					activeFrame={activeFrame}
				/>
			</>
		);
	}

	return <Loading />;
};
