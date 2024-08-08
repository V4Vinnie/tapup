import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, X, Check } from 'lucide-react-native';

const PhotoCaptureScreen = ({ navigation }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const savePhoto = () => {
    navigation.navigate('StoryView', { newPhotoUri: photoUri });
  };

  const discardPhoto = () => {
    setPhotoUri(null);
  };

  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white mb-4">We need your permission to use the camera</Text>
        <Pressable className="bg-blue-500 rounded-full px-6 py-3" onPress={requestCameraPermission}>
          <Text className="text-white text-base">Grant Permission</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-4 pt-4 pb-8">
        <View className="flex-1 mt-4 bg-gray-800 rounded-3xl overflow-hidden">
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              className="flex-1 w-full"
              resizeMode="cover"
            />
          ) : (
            <CameraView
              ref={cameraRef}
              className="flex-1 w-full"
              facing='back'
              enableTorch={false}
            />
          )}
          <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center z-20">
            <Pressable onPress={() => navigation.goBack()}>
              <X color="white" size={24} />
            </Pressable>
            <Text className="text-white text-lg font-bold">
              {photoUri ? 'Preview Photo' : 'Take Photo'}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        
        <View className="mt-4 flex-row justify-center items-center">
          {!photoUri ? (
            <Pressable
              className="bg-blue-500 p-4 rounded-full"
              onPress={takePicture}
            >
              <Camera color="white" size={32} />
            </Pressable>
          ) : (
            <View className="flex-row justify-center items-center space-x-8">
              <Pressable className="bg-red-500 p-3 rounded-full" onPress={discardPhoto}>
                <X color="white" size={24} />
              </Pressable>
              <Pressable className="bg-green-500 p-3 rounded-full" onPress={savePhoto}>
                <Check color="white" size={24} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PhotoCaptureScreen;