import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import Draggable from 'react-native-draggable';
import { height, width } from '../../utils/UseDimensoins';

export const DragText = ({
	changeText,
	item,
	index,
	updateTextEdit,
	setTextRefs,
	textRefs,
	...args
}) => {
	const [edit, setEdit] = useState(true);

	const [startPos, setStartPos] = useState({ x: item.x, y: item.y });

	const onShortPress = () => {
		updateTextEdit(true);
		setEdit(true);
	};

	const onSubmitText = () => {
		updateTextEdit(false);
		setEdit(false);
	};

	const txtRef = useRef();

	const textRef = useRef();

	useEffect(() => {
		setTextRefs([...textRefs, txtRef]);
	}, []);

	return (
		<Draggable
			onShortPressRelease={() => onShortPress()}
			onLongPress={() => changeText({ text: '' }, index)}
			onDragRelease={(event, gest, bounds) => {
				changeText(
					{ x: bounds.left, y: bounds.top, bounds: bounds, created: false },
					index
				);
			}}
			x={startPos ? startPos.x : 0}
			y={startPos ? startPos.y : 0}
		>
			{edit ? (
				<TextInput
					value={item.text}
					onChangeText={(e) => changeText({ text: e, created: false }, index)}
					onBlur={() => onSubmitText()}
					onFocus={() => updateTextEdit(true)}
					style={styles.textStyle}
					autoFocus={item.created}
					ref={txtRef}
				/>
			) : (
				<Text ref={textRef} style={styles.textStyle}>
					{item.text}
				</Text>
			)}
		</Draggable>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		zIndex: 99999,
	},

	inputStyle: {},
});
