import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

const AnswerOption = ({
  answer,
  index,
  isSelected,
  correctAnswer,
  showResult,
  onPress
}) => (
  <TouchableOpacity
    onPress={() => onPress(index)}
    className={`w-full py-3 px-4 rounded-xl mb-3 ${isSelected
        ? index === correctAnswer
          ? 'bg-green-500'
          : 'bg-red-500'
        : 'bg-gray-700'
      } ${showResult && !isSelected ? 'opacity-70' : ''}`}
    disabled={showResult && isSelected}
  >
    <View className="flex-row items-center justify-between">
      <Text className={`text-white text-base ${isSelected ? 'font-semibold' : ''}`}>{answer}</Text>
      {showResult && index === correctAnswer && isSelected && (
        <Check color="white" size={20} />
      )}
    </View>
  </TouchableOpacity>
);

export default AnswerOption;