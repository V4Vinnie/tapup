import { LogBox } from 'react-native';
import { TapsProvider } from './Providers/TapsProvider';
import { UserProvider } from './Providers/UserProvider';
import { AppRoutes } from './Views/AppRoutes';
import 'expo-dev-client';
import { SetNavBarProvider } from './Providers/ShowNavBarProvider';
import { QuestionsProvider } from './Providers/QuestionsProvider';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { Loading } from './Components/Loading';

LogBox.ignoreAllLogs();

export default function App() {
	const [fontsLoaded, fontError] = useFonts({
		'DMSans-Bold': require('./assets/fonts/DMSans/DMSans-Bold.ttf'),
		'DMSans-Medium': require('./assets/fonts/DMSans/DMSans-Medium.ttf'),
		'DMSans-Regular': require('./assets/fonts/DMSans/DMSans-Regular.ttf'),
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded || fontError) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) {
		return <Loading />;
	}

	return (
		<UserProvider onLayout={onLayoutRootView}>
			<TapsProvider>
				<QuestionsProvider>
					<SetNavBarProvider>
						<AppRoutes />
					</SetNavBarProvider>
				</QuestionsProvider>
			</TapsProvider>
		</UserProvider>
	);
}
