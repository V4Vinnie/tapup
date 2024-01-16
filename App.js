import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/providers/AuthProvider';
import RootStack from './src/navigation/RootStack';
import { QuestionProvider } from './src/providers/QuestionProvider';


export default function App() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <QuestionProvider>
            <StatusBar translucent />
            <RootStack />
          </QuestionProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}