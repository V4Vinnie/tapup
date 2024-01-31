import { TProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { UserCredential, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/Firebase';
import {
	getProfile,
	loginUser,
	onUser,
	registerUser,
	sendForgotPasswordEmail,
} from '../database/services/UserService';
import { RootStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

const AuthContext = React.createContext<{
	user: TProfile | null;
	handleLogin: (
		email: string,
		password: string
	) => Promise<UserCredential | void>;
	handleSignup: (
		name: string,
		email: string,
		password: string,
		profileImage?: string
	) => Promise<UserCredential | void>;
	handleLogout: () => void;
	status: {
		type: 'error' | 'success';
		message: string;
	} | null;
	handleForgotPassword: (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
}>({
	user: null,
	handleLogin: (email: string, password: string) => Promise.resolve(),
	handleSignup: (
		name: string,
		email: string,
		password: string,
		profileImage?: string
	) => Promise.resolve(),
	handleLogout: () => {},
	status: null,
	handleForgotPassword: (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {},
});

type Props = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const navigator =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [user, seTProfile] = React.useState<TProfile | null>(null);
	const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
	const [status, setStatus] = React.useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const handleLogin = async (email: string, password: string) => {
		if (email == '' || password == '') {
			setStatus({
				type: 'error',
				message: 'Email and password are required',
			});
			return;
		}
		return await loginUser(email, password).catch(() =>
			setStatus({
				type: 'error',
				message: 'Invalid email or password',
			})
		);
	};

	const handleSignup = async (
		name: string,
		email: string,
		password: string,
		profileImage?: string
	) => {
		setStatus(null);
		return registerUser(name, email, password, profileImage).catch(() =>
			setStatus({
				type: 'error',
				message: 'Invalid email or password',
			})
		);
	};

	const handleLogout = () => {
		auth.signOut();
		seTProfile(null);
		setStatus(null);
	};

	const handleForgotPassword = (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		setStatus(null);
		setLoading(true);
		sendForgotPasswordEmail(email)
			.then(() => {
				setStatus({
					type: 'success',
					message: 'Password reset email sent',
				});
			})
			.catch((error) => {
				setStatus({ type: 'error', message: 'Invalid email' });
			})
			.finally(() => setLoading(false));
	};

	React.useEffect(
		() =>
			onAuthStateChanged(
				auth,
				async (user) => {
					if (user) {
						const _user = await getProfile(user.uid);
						seTProfile({ ..._user, ...user } as TProfile);
						console.log(_user);
					} else {
						seTProfile(null);
					}
					setLoadingInitial(false);
				},
				console.log
			),
		[]
	);

	React.useEffect(() => {
		const handleFocus = () => {
			setStatus(null);
		};

		navigator.addListener('state', handleFocus);
	}, []);

	const authProperties = React.useMemo(
		() => ({
			user,
			handleLogin,
			handleSignup,
			handleLogout,
			status,
			handleForgotPassword,
		}),
		[
			user,
			handleLogin,
			handleSignup,
			handleLogout,
			status,
			handleForgotPassword,
		]
	);

	return (
		<AuthContext.Provider value={authProperties}>
			{!loadingInitial && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return React.useContext(AuthContext);
};
