/* 
This AccountHeader is created by Arthur Cremelie.
And does not use the previously created ProfileHeader and ProfileComponent.
I wanted to make another design, but feel free to change it.
*/

import React from 'react';
import { View, Text, Image } from 'react-native';

/*
--- TODO ---
TODO: connect with user data
TODO: style
*/

const AccountHeader = ({
	name,
	imageUrl,
}: {
	name: string;
	imageUrl: string;
}) => {
	return (
		<View
			style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
			<Image
				source={{ uri: imageUrl ?? '' }}
				style={{
					width: 80,
					height: 80,
					borderRadius: 40,
					borderWidth: 0,
					borderColor: '#ff3b5c',
				}}
			/>
			<Text
				style={{
					color: 'white',
					fontSize: 24,
					fontWeight: 'bold',
					marginLeft: 16,
				}}>
				{name}
			</Text>
		</View>
	);
};

export default AccountHeader;
