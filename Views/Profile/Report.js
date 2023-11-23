import { Fragment, useState } from 'react';
import { PageHeader } from '../../Components/PageHeader';
import { Colors } from '../../Constants/Colors';
import {
	ImageBackground,
	KeyboardAvoidingView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import blueBG from '../../assets/bleuBG.png';
import { bodyText, buttonStyle } from '../../style';
import { height, width } from '../../utils/UseDimensoins';
import { MediumText } from '../../Components/Text/MediumText';
import uuid from 'uuid';
import { useUser } from '../../Providers/UserProvider';
import { addNewBug } from '../../utils/fetch';
import { BoldText } from '../../Components/Text/BoldText';

export const Report = ({ navigation }) => {
	const { user } = useUser();
	const [message, setMessage] = useState();
	const [isSending, setIsSending] = useState(false);
	const [isSend, setIsSend] = useState(false);

	const sendIssue = async () => {
		setIsSending(true);

		if (message) {
			const newMessage = {
				id: uuid.v4(),
				message: message,
				userId: user.id,
				send_date: new Date(),
			};
			await addNewBug(newMessage);
			setIsSend(true);
			setIsSending(false);
		} else {
			setIsSending(false);
		}
	};

	return (
		<Fragment>
			<PageHeader
				titleName={'Report a bug'}
				navigation={navigation}
				backgroundColor={Colors.primary.lightBleu}
				withBack
			/>
			<View
				style={{
					height: '100%',
					backgroundColor: Colors.primary.white,
				}}
			>
				<ImageBackground
					source={blueBG}
					imageStyle={{ height: 530, top: -150, zIndex: -10 }}
					style={{ padding: 10 }}
				>
					{isSend ? (
						<BoldText
							style={{
								fontSize: 50,
								lineHeight: 50,
								color: Colors.primary.bleuBottom,
								opacity: 0.5,
								textTransform: 'uppercase',
								marginTop: 20,
							}}
						>
							Your report is send
						</BoldText>
					) : (
						<KeyboardAvoidingView
							keyboardVerticalOffset={-200}
							behavior='position'
						>
							<TextInput
								editable
								value={message}
								onChangeText={
									isSending ? null : (newText) => setMessage(newText)
								}
								style={styles.inputStyle}
								placeholder='Message'
								placeholderTextColor={`${Colors.primary.white}`}
								multiline
							/>

							<TouchableOpacity
								disabled={isSending ? true : message ? false : true}
								style={
									message
										? { ...buttonStyle }
										: isSending
										? { ...buttonStyle, opacity: 0.5 }
										: { ...buttonStyle, opacity: 0.5 }
								}
								onPress={() => sendIssue()}
							>
								<MediumText
									style={{ fontSize: 20, color: Colors.primary.white }}
								>
									Report issue
								</MediumText>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					)}
				</ImageBackground>
			</View>
		</Fragment>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		padding: 12,
		borderColor: Colors.primary.white,
		borderWidth: 2,
		borderRadius: 18,
		...bodyText,
		marginBottom: 18,
		fontSize: 20,
		height: height / 3,
		width: width - 20,
	},

	signUp: {
		backgroundColor: Colors.primary.pink,
	},
});
