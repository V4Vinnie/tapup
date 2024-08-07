import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, Edit, Plus, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';

const StoryHeader = ({ 
  currentIndex, 
  totalStories, 
  isEditing, 
  setIsEditing, 
  openModal, 
  deleteCurrentStory 
}) => {
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
      locations={[0, 0.6, 1]}
      className="absolute top-0 left-0 right-0 z-10"
    >
      <View className="px-4 pt-2 pb-2">
        <ProgressBar currentIndex={currentIndex} totalStories={totalStories} />
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center">
            <Camera color="#3b82f6" size={24} />
            <Text className="text-white text-lg font-bold ml-2">Testing</Text>
            <Text className="text-gray-200 text-lg ml-1">Safety</Text>
          </View>
          <View className="flex-row space-x-6">
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Edit size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openModal}>
              <Plus size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteCurrentStory}>
              <Trash2 size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default StoryHeader;