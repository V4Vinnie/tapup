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
import { Text, View } from "react-native";
import { mode, themeColors } from "./src/utils/constants";
import { useEffect, useState } from "react";
import { useTrackingPermissions } from 'expo-tracking-transparency';
import AppButton from "./src/components/AppButton";

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [trackingPermission, requestPermission] = useTrackingPermissions();

  const [loaded] = useFonts({
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => { requestPermission() }, []);

  if (!trackingPermission?.granted) {
    return <View style={{ flex: 1, backgroundColor: themeColors[mode].primaryBackground, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ color: 'white', textAlign: 'center', marginBottom: 12, fontSize: 24 }}>Not enough permissions!</Text>
      <Text style={{ color: 'white', textAlign: 'center', marginBottom: 24 }}>The permission to track data is not granted, make sure to grant the permission to use the app.</Text>
      <AppButton title="Request Permission" onPress={requestPermission} />
    </View>
  }

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