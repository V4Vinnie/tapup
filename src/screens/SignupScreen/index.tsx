import { useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	
	Text,
	Pressable,
	View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';

import { RootStackParamList, Routes } from '../../navigation/Routes';
import { FocusAwareStatusBar } from '../../components/FocusAwareStatusBar';
import AppHeader from '../../components/AppHeader';
import { scrollViewContainer, scrollViewContentContainer } from '../LoginScreen';
import RegisterUserDetails from './RegisterUserDetails';
import CustomSwiperDot from '../../components/CustomSwiperDot';
import useKeyboard from '../../hooks/useKeyboard';
import AddCompanyCode from './AddCompanyCode';
import AddInformation from './AddInformation';
import { useAuth } from '../../providers/AuthProvider';
import { useCompany } from '../../providers/CompanyProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const { isKeyboardOpen } = useKeyboard();
  const { handleSignup, authErrors } = useAuth();
  const { company } = useCompany();
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
    jobType: '',
  });
  const [isSending, setIsSending] = useState(false);

  const swiper = useRef<Swiper>(null);

  const updateFormData = (field: keyof typeof formData) => 
    (value: string | ((prevState: string) => string)) => {
      setFormData(prev => ({ 
        ...prev, 
        [field]: typeof value === 'function' ? value(prev[field]) : value 
      }));
    };

  const signUp = async () => {
    setIsSending(true);
    try {
      await handleSignup(
        formData.username,
        formData.email,
        formData.password,
        company,
        formData.fullName,
        formData.jobType
      );
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (authErrors) {
      swiper.current?.scrollTo(0);
    }
  }, [authErrors]);

  const swiperSlides = [
    <RegisterUserDetails
      key="userDetails"
      username={formData.username}
      setProfilename={updateFormData('username')}
      email={formData.email}
      setEmail={updateFormData('email')}
      password={formData.password}
      setPassword={updateFormData('password')}
      swiper={swiper}
    />,
    <AddCompanyCode
      key="companyCode"
      addButtonPress={() => swiper?.current?.scrollBy(1)}
      canSkip
      skipButtonPress={() => swiper?.current?.scrollBy(1)}
    />,
    <AddInformation
      key="information"
      setFullName={updateFormData('fullName')}
      fullName={formData.fullName}
      setJobType={updateFormData('jobType')}
      jobType={formData.jobType}
      signUp={signUp}
      isSending={isSending}
    />,
  ];

  return (
    <SafeAreaView className='flex-1 bg-dark-primaryBackground'>
      <AppHeader headerWithBack title='Sign Up' />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View className='flex-1 justify-center items-center'>
          <Swiper
            ref={swiper}
            height={height * 0.6}
            width={width}
            paginationStyle={{ top: 50 }}
            showsPagination
            dot={<CustomSwiperDot />}
            activeDot={<CustomSwiperDot active />}
            scrollEnabled={false}
            loop={false}
            showsButtons={false}
          >
            {swiperSlides}
          </Swiper>
        </View>
        <View className='flex-row items-center justify-center py-4'>
          <Text className='text-base font-inter-regular text-dark-subTextColor'>
            Already have an account?
          </Text>
          <Pressable onPress={() => navigate(Routes.LOGIN)}>
            <Text className='text-base font-inter-bold text-dark-textColor'> Login</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
