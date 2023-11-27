import { useEffect, useRef, useState } from 'react';
import { ImageBackground, SafeAreaView } from 'react-native';
import { Colors } from '../../Constants/Colors';
import { useUser } from '../../Providers/UserProvider';
import { cacheContents } from '../../utils/downloadAssets';
import { fetchUser, updateFrame, updateUser } from '../../utils/fetch';
import { findById, findWatchedFrameIndex } from '../../utils/findById';
import { height, width } from '../../utils/UseDimensoins';
import { Back } from '../Back';
import { Frame } from './Frame';
import { FramePogress } from './FrameProgress';
import { Loading } from '../Loading';
import { useSetNavBar } from '../../Providers/ShowNavBarProvider';
import { AskQuestion } from './AskQuestion';
import { GOALS } from '../../Views/Profile/SelectGoal';
import { formatDate } from '../../utils/formatDate';
import { checkHasBadge } from '../../utils/checkHasBadge';
import { MediumText } from '../Text/MediumText';
import { FrameFinished } from './FrameFinished';

export const Frames = ({ navigation, frame }) => {
	const { user, setUser } = useUser();

	const [prevActiveFrame, setPrevActiveFrame] = useState(0);

	const [activeFrame, setActiveFrame] = useState(0);

	const [showTime, setShowTime] = useState(frame.contents[0].time);

	const [isLoading, setIsLoading] = useState(true);

	const [frameContents, setFrameContents] = useState(undefined);

	const [newBadges, setNewBadge] = useState(undefined);

	const { setShowNavBar } = useSetNavBar();

	const [showQuestion, setShowQuestion] = useState(false);

	const [creator, setCreator] = useState(undefined);

	const [isFinished, setIsFinished] = useState(false);

	const [isLiked, setIsLiked] = useState(false);
	const [pauseVideo, setPauseVideo] = useState(false);

	const hasCompletedFrames = () => {
		let hasCompleted = false;

		for (let ind = 0; ind < user.watchedFrames.length; ind++) {
			const watchedFrame = user.watchedFrames[ind];

			if (watchedFrame.isDone) {
				hasCompleted = true;
			}
		}

		return hasCompleted;
	};

	const goNext = async () => {
		if (activeFrame + 1 === frameContents.length) {
			if (!isFinished) {
				setIsFinished(true);

				let badges = [...user.badges];
				let _newBadges = [];

				if (!hasCompletedFrames() && !checkHasBadge('ID468', badges)) {
					_newBadges.push({
						name: 'firstFrame',
						id: 'ID468',
						img: 'badge_FirstFrame.png',
					});

					badges.push({
						name: 'firstFrame',
						id: 'ID468',
						img: 'badge_FirstFrame.png',
					});
				}

				let selectedGoal;
				if (user.goal) {
					GOALS.map((goal) => {
						if (user.goal && goal.id === user.goal.id) {
							selectedGoal = goal;
						}
					});
				} else {
					selectedGoal = { goal: 1000000 };
				}

				const hasWatched = [...user.watchedFrames].filter(
					(_watched) => _watched.id !== frame.id
				);

				const newWatched = {
					id: frame.id,
					isDone: true,
					watchedContentIndex: activeFrame,
					frameLink: {
						id: frame.id,
						topicId: frame.topicId,
						tapId: frame.tapId,
					},
					watchedDate: new Date(Date.now()),
				};

				const watchedInWeek = [...hasWatched, newWatched].filter(
					(_watched) =>
						Date.parse(formatDate(_watched.watchedDate)) >=
							Date.parse(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) &&
						_watched.isDone
				);

				if (
					watchedInWeek.length >= selectedGoal.goal &&
					!checkHasBadge('ddFfhdks1532sqdqhg', badges)
				) {
					_newBadges.push({
						name: 'weekGoal',
						id: 'ddFfhdks1532sqdqhg',
						img: 'badge_WeekGoal.png',
					});

					badges.push({
						name: 'weekGoal',
						id: 'ddFfhdks1532sqdqhg',
						img: 'badge_WeekGoal.png',
					});
				}

				setNewBadge(_newBadges);

				const _user = {
					...user,
					badges: badges,
					watchedFrames: [...hasWatched, newWatched],
				};

				setUser({
					..._user,
				});

				updateUser({
					..._user,
				});
			}
			return;
		} else if (!showQuestion) {
			const newFrame = activeFrame + 1;
			const _prevActiveFrame = activeFrame;
			setPrevActiveFrame(_prevActiveFrame);
			setPauseVideo(false);
			setActiveFrame(newFrame);
			setShowTime(frameContents[newFrame].time);
		}
	};

	const goPrev = () => {
		if (!isFinished) {
			if (activeFrame === 0) {
				setActiveFrame(0);
			} else if (!showQuestion) {
				const _prevActiveFrame = activeFrame;
				const newFrame = activeFrame - 1;
				setPrevActiveFrame(_prevActiveFrame);
				if (newFrame === 0) {
					setActiveFrame(0);
					setPrevActiveFrame(1);
				} else {
					setActiveFrame(activeFrame - 1);
				}
				setPauseVideo(false);
				setShowTime(frameContents[newFrame].time);
			}
		}
	};

	const chachingItems = async ({ isFirstLoad, locationInd, isPrev }) => {
		let _frameContens;
		if (!frameContents) {
			_frameContens = [...frame.contents];
		} else {
			_frameContens = [...frameContents];
		}

		let contents = [];

		let currentLocation = locationInd + 1;
		let toLocation = locationInd + 2;

		if (isFirstLoad) {
			const _watched = findById(user.watchedFrames, frame.id);

			console.log(_watched);

			if (_watched[0]) {
				if (_watched[0].watchedContentIndex === frame.contents.length) {
					setActiveFrame(frame.contents.length - 1);
					currentLocation = frame.contents.length - 1;
					toLocation = frame.contents.length;
				} else {
					setActiveFrame(_watched[0].watchedContentIndex);
					currentLocation = _watched[0].watchedContentIndex - 1;
					toLocation = currentLocation + 3;
				}

				if (_watched[0].isLiked) {
					setIsLiked(true);
				}
			} else {
				setActiveFrame(0);
				currentLocation = 0;
			}
		}

		if (isPrev) {
			currentLocation = locationInd - 2;
			toLocation = locationInd + 1;
		}

		console.log(currentLocation, 'ACTIVEIND:', locationInd);

		for (let index = currentLocation; index < toLocation; index++) {
			const _content = _frameContens[index];

			if (_content && !_content.contentUrl) {
				const contentURL = `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${frame.id}%2F${_content.content}?alt=media`;
				contents.push(contentURL);
				console.log('pushed', _content);
			}
		}

		try {
			if (contents.length !== 0) {
				const downloaded = await Promise.all([...cacheContents(contents)]);
				let downloadedInd = 0;
				for (let index = currentLocation; index < toLocation; index++) {
					if (_frameContens[index]) {
						_frameContens[index].contentUrl =
							downloaded[downloadedInd].localUri;
						downloadedInd++;
					}
				}
			}
		} catch (e) {
		} finally {
			setFrameContents(_frameContens);
			setShowTime(_frameContens[0].time);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const getCreator = async () => {
			const _creator = await fetchUser(frame.creator);
			if (_creator) {
				setCreator(_creator);
			}
		};

		getCreator();
	}, [frame]);

	useEffect(() => {
		setShowNavBar(false);

		const gestureEndListener = (e) => {
			setShowNavBar(true);
		};

		const gestureHandler = navigation.addListener(
			'beforeRemove',
			gestureEndListener
		);
		return () => {
			gestureHandler.remove();
		};
	}, []);

	useEffect(() => {
		const cacheContent = async () => {
			if (!frameContents) {
				setIsLoading(true);
				await chachingItems({ isFirstLoad: true, locationInd: 0 });
			} else if (prevActiveFrame < activeFrame) {
				await chachingItems({ locationInd: activeFrame });
			} else {
				await chachingItems({ locationInd: activeFrame, isPrev: true });
			}
		};
		cacheContent();
	}, [activeFrame]);

	const countInterval = useRef(null);

	const saveGoBack = async () => {
		const checkIsDone = () => {
			if (activeFrame + 1 === frameContents.length) {
				return true;
			} else {
				return false;
			}
		};
		const watchedDate = new Date();
		const frameData = {
			id: frame.id,
			isDone: checkIsDone(),
			frameLink: { id: frame.id, topicId: frame.topicId, tapId: frame.tapId },
			watchedContentIndex: activeFrame,
			watchedDate: watchedDate,
			isLiked: isLiked,
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

		setUser({
			...user,
			selectedTopics: selected,
			watchedFrames: allWatched,
			lastWatched: watchedDate,
		});

		updateUser({
			...user,
			selectedTopics: selected,
			watchedFrames: allWatched,
			lastWatched: watchedDate,
		});
		setShowNavBar(true);
		navigation.goBack();
	};

	const toggleLike = async () => {
		let likedFrame = { ...frame };

		if (isLiked) {
			setIsLiked(false);
			const newLiked = [...likedFrame.likedBy].filter(
				(likeId) => likeId !== user.id
			);
			likedFrame.likedBy = [newLiked];
		} else {
			setIsLiked(true);
			if (likedFrame.likedBy) {
				likedFrame.likedBy = [...likedFrame.likedBy, user.id];
			} else {
				likedFrame.likedBy = [user.id];
			}
		}

		await updateFrame(likedFrame);
		setFrameContents(likedFrame.contents);
	};

	if (!isLoading) {
		return (
			<>
				<ImageBackground
					blurRadius={75}
					source={{
						uri: `https://firebasestorage.googleapis.com/v0/b/tap-up.appspot.com/o/frames%2F${frame.id}%2F${frame.img}?alt=media`,
					}}
					imageStyle={{
						width: width,
						height: height,
						objectFit: 'cover',
						backgroundColor: Colors.primary.bleuBottom,
					}}
					style={{
						position: 'absolute',
						zIndex: 0,
						width: width,
						height: height,
					}}
				></ImageBackground>
				<SafeAreaView
					style={{
						position: 'absolute',
						zIndex: 10,
						width: width - 30,
						marginLeft: 15,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}
				>
					<Back navigate={() => saveGoBack()} />

					<MediumText
						style={{
							fontSize: 24,
							textAlign: 'right',
							color: Colors.primary.white,
							maxWidth: (width / 4) * 3,
						}}
					>
						{frame.title}
					</MediumText>
				</SafeAreaView>

				{frameContents &&
					activeFrame + 1 === frameContents.length &&
					isFinished && (
						<FrameFinished
							newBadges={newBadges}
							frame={frame}
							creator={creator}
						/>
					)}

				{showQuestion && (
					<AskQuestion
						frame={frame}
						creator={creator}
						setShowQuestion={setShowQuestion}
						setPauseVideo={setPauseVideo}
					/>
				)}

				<Frame
					item={frameContents[activeFrame]}
					index={activeFrame}
					goNext={goNext}
					goPrev={goPrev}
					pauseVideo={pauseVideo}
				/>

				<FramePogress
					length={frameContents.length}
					updateActiveFrame={setActiveFrame}
					time={frameContents[activeFrame].time}
					activeFrame={activeFrame}
					goNext={goNext}
					setShowQuestion={setShowQuestion}
					showQuestion={showQuestion}
					isLiked={isLiked}
					toggleLike={toggleLike}
					setPauseVideo={setPauseVideo}
					pausedVideo={pauseVideo}
				/>
			</>
		);
	}

	return <Loading />;
};
