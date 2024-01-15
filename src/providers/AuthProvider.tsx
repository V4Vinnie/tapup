import { TUser } from '../types';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/Firebase/Firebase';
import {
	getUser,
	loginUser,
	registerUser,
	sendForgotPasswordEmail,
} from '../utils/Firebase/services/UserService';
import { RootStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

const AuthContext = React.createContext<{
	user: TUser | null;
	handleLogin: (
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
	handleSignup: (
		name: string,
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
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
	handleLogin: (
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {},
	handleSignup: (
		name: string,
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {},
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

	const [user, setUser] = React.useState<TUser | null>(null);
	const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
	const [status, setStatus] = React.useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	const handleLogin = (
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		if (email == '' || password == '') {
			setStatus({
				type: 'error',
				message: 'Email and password are required',
			});
			return;
		}
		loginUser(email, password)
			.catch(() =>
				setStatus({
					type: 'error',
					message: 'Invalid email or password',
				})
			)
			.finally(() => setLoading(false));
	};

	const handleSignup = (
		name: string,
		email: string,
		password: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		setStatus(null);
		registerUser(name, email, password)
			.catch(() =>
				setStatus({
					type: 'error',
					message: 'Invalid email or password',
				})
			)
			.finally(() => setLoading(false));
	};

	const handleLogout = () => {
		auth.signOut();
		setUser(null);
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
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					const _user = await getUser(user.uid);
					setUser({ ..._user, ...user } as TUser);
				} else {
					setUser(null);
				}
				setLoadingInitial(false);
			}),
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
