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
	updateTextIndex,
	isTextEditing,
	...args
}) => {
	const [edit, setEdit] = useState(false);

	const [startPos, setStartPos] = useState({ x: item.x, y: item.y });

	const [centerWidth, setCenterWidth] = useState(50);

	const onShortPress = () => {
		updateTextIndex(index);
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

	useEffect(() => {
		console.log(textRef.current);
	}, [textRef]);

	const findDimesions = (layout) => {
		const { x, y, width, height } = layout;
		console.warn(width);
		setCenterWidth(width / 2);
	};

	return (
		<Draggable
			disabled={isTextEditing}
			onShortPressRelease={() => onShortPress()}
			onLongPress={() => changeText({ text: '' }, index)}
			onDragRelease={(event, gest, bounds) => {
				changeText(
					{ x: bounds.left, y: bounds.top, bounds: bounds, created: false },
					index
				);
			}}
			x={edit ? width / 2 - centerWidth : startPos ? startPos.x : 0}
			y={edit ? height / 2 - 150 : startPos ? startPos.y : 0}
		>
			{edit ? (
				<TextInput
					returnKeyType='send'
					blurOnSubmit
					multiline={true}
					value={item.text}
					onChangeText={(e) => changeText({ text: e, created: false }, index)}
					onBlur={() => onSubmitText()}
					onFocus={() => updateTextEdit(true)}
					style={
						item.style
							? { ...styles.textStyle, ...item.style }
							: { ...styles.textStyle }
					}
					autoFocus={item.created}
					ref={txtRef}
				/>
			) : (
				<Text
					ref={textRef}
					style={
						item.style
							? { ...styles.textStyle, ...item.style }
							: { ...styles.textStyle }
					}
					onLayout={(event) => findDimesions(event.nativeEvent.layout)}
				>
					{item.text}
				</Text>
			)}
		</Draggable>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		maxWidth: '80%',
		fontWeight: 'bold',
		fontSize: 20,
		zIndex: 99999,
	},

	inputStyle: {},
});
