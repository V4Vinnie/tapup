import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/providers/AuthProvider';
import RootStack from './src/navigation/RootStack';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { TapProvider } from './src/providers/TapProvider';
import { TopicProvider } from './src/providers/TopicProvider';
import { ProfileProvider } from './src/providers/ProfileProvider';

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [loaded] = useFonts({
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!loaded) {
    return null; // TODO: Add a No internet connection screen
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <TopicProvider>
            <TapProvider>
              <ProfileProvider>
                <StatusBar translucent />
                <RootStack />
              </ProfileProvider>
            </TapProvider>
          </TopicProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}