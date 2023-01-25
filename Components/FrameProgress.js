import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { height, width } from '../utils/UseDimensoins';

export const FramePogress = ({ length, activeFrame }) => {
	const [bars, setBars] = useState([]);

	useEffect(() => {
		let _bars = [];
		for (let index = 0; index < length; index++) {
			if (index <= activeFrame) {
				_bars.push(
					<View
						style={
							index === length - 1
								? {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.pink,
								  }
								: {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.pink,
										borderRightWidth: 1,
										borderRightColor: Colors.primary.white,
								  }
						}
					></View>
				);
			} else {
				_bars.push(
					<View
						style={
							index === length - 1
								? {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.black,
								  }
								: {
										width: (width - 30) / length,
										backgroundColor: Colors.primary.black,
										borderRightWidth: 1,
										borderRightColor: Colors.primary.white,
								  }
						}
					></View>
				);
			}
		}
		setBars(_bars);
	}, [activeFrame]);

	return (
		<View
			style={{
				position: 'absolute',
				zIndex: 10,
				width: width - 30,
				height: 10,
				marginLeft: 15,
				top: height - 70,
				flexDirection: 'row',
				borderRadius: 50,
				overflow: 'hidden',
			}}
		>
			{bars.map((bar) => bar)}
		</View>
	);
};
