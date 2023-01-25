import { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-new-snap-carousel';
import { Colors } from '../Constants/Colors';
import { cacheImages, cacheVideo } from '../utils/downloadAssets';
import { height, width } from '../utils/UseDimensoins';
import { Back } from './Back';
import { Frame } from './Frame';
import { FramePogress } from './FrameProgress';
import { Loading } from './Loading';

export const Frames = ({ navigation, frame }) => {
	const [carRef, setCarRef] = useState();

	const [activeFrame, setActiveFrame] = useState(0);

	const [showTime, setShowTime] = useState(10000);

	const [isLoading, setIsLoading] = useState(true);

	const [frameContents, setFrameContents] = useState([]);

	const goNext = () => {
		carRef.snapToNext();
	};

	const goPrev = () => {
		carRef.snapToPrev();
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
				setFrameContents(_frameContens);
				setShowTime(_frameContens[0].time);
				setIsLoading(false);
			}
		};

		cacheContent();
	}, [frame]);

	const changeFrame = (i) => {
		setShowTime(frameContents[i].time);
		setActiveFrame(i);
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
					<Back navigate={() => navigation.goBack()} />
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
				<Carousel
					ref={(c) => {
						setCarRef(c);
					}}
					data={frameContents}
					renderItem={(contenFrame) => (
						<Frame {...contenFrame} goPrev={goPrev} goNext={goNext} />
					)}
					sliderWidth={width}
					itemWidth={width}
					itemHeight={height}
					sliderHeight={height}
					autoplay={true}
					autoplayDelay={0}
					autoplayInterval={showTime}
					layout={'stack'}
					layoutCardOffset={-2}
					inactiveSlideScale={1}
					inactiveSlideOpacity={1}
					containerCustomStyle={{ backgroundColor: Colors.primary.bleuBottom }}
					onSnapToItem={(index) => changeFrame(index)}
				/>

				<FramePogress length={frameContents.length} activeFrame={activeFrame} />
			</>
		);
	}

	return <Loading />;
};
