import { TCompany, TProfile } from '../types';
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
import { useCompany } from './CompanyProvider';
import { getCompanyByCode } from '../database/services/CompaniesService';
import { primaryColor } from '../utils/constants';

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
		profileImage: string,
		company: TCompany,
		information: { fullName: string; jobType: string }
	) => Promise<UserCredential | void>;
	handleLogout: () => void;
	authErrors: Record<string, any> | null;
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
		profileImage: string,
		company: TCompany,
		information: { fullName: string; jobType: string }
	) => Promise.resolve(),
	handleLogout: () => {},
	authErrors: null,
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
	const { companyColor, setCompanyColor } = useCompany();

	const [user, seTProfile] = React.useState<TProfile | null>(null);
	const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
	const [authErrors, setAuthErrors] = React.useState<Record<
		string,
		any
	> | null>(null);

	const handleLogin = async (email: string, password: string) => {
		if (email == '' || password == '') {
			setAuthErrors({
				message: 'Email and password are required',
			});
			return;
		}
		return await loginUser(email, password).catch(() =>
			setAuthErrors({
				message: 'Invalid email or password',
			})
		);
	};

	const handleSignup = async (
		name: string,
		email: string,
		password: string,
		profileImage: string,
		company: TCompany,
		information: { fullName: string; jobType: string }
	) => {
		setAuthErrors(null);
		return registerUser(
			name,
			email,
			password,
			profileImage,
			company,
			information
		).catch(() =>
			setAuthErrors({
				userDetails: {
					message:
						"Make sure to use a valid email and a password with at least 6 characters. Don't forget your profile picture!",
				},
				information: {
					message:
						'Invalid information. Make sure to fill all the fields.',
				},
			})
		);
	};

	const handleLogout = () => {
		auth.signOut();
		seTProfile(null);
		setAuthErrors(null);
	};

	const handleForgotPassword = (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		setAuthErrors(null);
		setLoading(true);
		sendForgotPasswordEmail(email)
			.then(() => {
				setAuthErrors({
					type: 'success',
					message: 'Password reset email sent',
				});
			})
			.catch((error) => {
				setAuthErrors({ type: 'error', message: 'Invalid email' });
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
						if (!_user?.companyInfo?.companyCode) return;
						const company = await getCompanyByCode(
							_user?.companyInfo?.companyCode
						);
						if (company) setCompanyColor(company.primaryColor);
					} else {
						seTProfile(null);
						setCompanyColor(primaryColor);
					}
					setLoadingInitial(false);
				},
				console.log
			),
		[]
	);

	React.useEffect(() => {
		const handleFocus = () => {
			setAuthErrors(null);
		};

		navigator.addListener('state', handleFocus);
	}, []);

	const authProperties = React.useMemo(
		() => ({
			user,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
			handleForgotPassword,
		}),
		[
			user,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
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
