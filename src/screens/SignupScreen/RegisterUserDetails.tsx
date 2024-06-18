import { Text, View } from "react-native";
import AppInput from "../../components/AppInput";
import AppButton from "../../components/AppButton";
import Icon from "react-native-vector-icons/AntDesign";
import { assets } from "../../../assets/Assets";
import ProfilePicture from "./ProfilePicture";
import Swiper from "react-native-swiper";
import useKeyboard from "../../hooks/useKeyboard";
import { useEffect, useMemo } from "react";
import { useAuth } from "../../providers/AuthProvider";

type Props = {
  image: string | null;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setProfilename: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  swiper: React.RefObject<Swiper>;
};

const RegisterUserDetails = ({
  image,
  setModalOpen,
  username,
  setProfilename: setProfilename,
  email,
  setEmail,
  password,
  setPassword,
  swiper,
}: Props) => {
  const { isKeyboardOpen } = useKeyboard();
  const { authErrors } = useAuth();

  const disabledState = useMemo(() => {
    return !username || password.length < 6 || !email || !image;
  }, [username, password, email, image]);

  return (
    <View
      className={`w-4/5 mx-auto h-[85%] flex justify-between ${authErrors && "h-full"}`}
    >
      <View>
        {!isKeyboardOpen && (
          <ProfilePicture
            image={image ? { uri: image } : assets.profile_placeholder}
            onPress={() => setModalOpen(true)}
          />
        )}
        <Text className="text-3xl font-inter-bold text-center text-dark-textColor">
          {"Create account"}
        </Text>

        <Text className="text-base font-inter-medium text-center text-dark-subTextColor">
          {"Quickly create account"}
        </Text>

        <AppInput
          containerProps={{
            className: "mt-6",
          }}
          leftIcon={{
            component: <Icon name="user" size={16} color={"gray"} />,
          }}
          inputProps={{
            placeholder: "Username",
            value: username,
            keyboardType: "default",
            onChangeText: (username) => {
              setProfilename(username);
            },
          }}
        />
        <AppInput
          containerProps={{
            className: "mt-2",
          }}
          leftIcon={{
            component: <Icon name="mail" size={16} color={"gray"} />,
          }}
          inputProps={{
            placeholder: "Email",
            value: email,
            keyboardType: "email-address",
            onChangeText: (email) => {
              setEmail(email);
            },
          }}
        />

        <AppInput
          containerProps={{
            className: "mt-2",
          }}
          leftIcon={{
            component: <Icon name="lock" size={16} color={"gray"} />,
          }}
          inputProps={{
            placeholder: "Password",
            value: password,
            secureTextEntry: true,
            onChangeText: (password) => {
              setPassword(password);
            }
          }}
        />
      </View>
      <View>
        <AppButton
          buttonProps={{
            disabled: disabledState,
            className: "mt-4",
            style: {
              opacity: disabledState ? 0.5 : 1,
            },
          }}
          title={"Next"}
          onPress={() => swiper.current?.scrollBy(1)}
        />
        {authErrors?.userDetails && (
          <Text
            className={
              "text-sm font-inter-medium text-red-500 text-center my-2 h-16"
            }
          >
            {authErrors?.userDetails.message}
          </Text>
        )}
      </View>
    </View>
  );
};

export default RegisterUserDetails;
