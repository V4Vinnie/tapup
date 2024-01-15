import * as React from 'react';
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type Props = StatusBar['props'];

export function FocusAwareStatusBar(props: Props) {
	const isFocused = useIsFocused();

	return isFocused ? <StatusBar {...props} /> : null;
}
