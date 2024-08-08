import "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/providers/AuthProvider';
import { CompanyProvider } from './src/providers/CompanyProvider';
import RootStack from './src/navigation/RootStack';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import 'react-native-gesture-handler';
import { View } from "react-native";
import { mode, themeColors } from "./src/utils/constants";

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
    return <View style={{ flex: 1, backgroundColor: themeColors[mode].primaryBackground }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <CompanyProvider>
          <AuthProvider>
            <StatusBar translucent style="light" />
            <RootStack />
          </AuthProvider>
        </CompanyProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}