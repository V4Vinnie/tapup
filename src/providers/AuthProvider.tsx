import { TCompany, TProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import { UserCredential, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/Firebase';
import {
	changeProfilePicture,
	getProfile,
	loginUser,
	registerUser,
	sendForgotPasswordEmail,
	setCompanyCodeInProfile,
	updateUser,
} from '../database/services/UserService';
import { RootStackParamList } from '../navigation/Routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useCompany } from './CompanyProvider';
import { getCompanyByCode } from '../database/services/CompaniesService';
import { primaryColor } from '../utils/constants';
import { clearFirebaseSubscriptions } from '../utils/firebaseSubscriptions';

const AuthContext = React.createContext<{
	user: TProfile | null;
	handleUpdateUser: <K extends keyof TProfile>(
		userid: string,
		key: K,
		value: TProfile[K]
	) => void;
	handleChangeProfilePic: (image: string) => Promise<string | undefined>;
	handleLogin: (
		email: string,
		password: string
	) => Promise<UserCredential | void>;
	handleSignup: (
		name: string,
		email: string,
		password: string,
		profileImage: string,
		company: TCompany | null,
		fullName: string,
		jobType: string
	) => Promise<UserCredential | void>;
	handleLogout: () => void;
	authErrors: Record<string, any> | null;
	handleForgotPassword: (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => void;
	handleSetCompanyCode: (companyCode: string) => void;
}>({
	user: null,
	handleUpdateUser: () => {},
	handleChangeProfilePic: () => Promise.resolve(''),
	handleLogin: (email: string, password: string) => Promise.resolve(),
	handleSignup: (
		name: string,
		email: string,
		password: string,
		profileImage: string,
		company: TCompany | null,
		fullName: string,
		jobType: string
	) => Promise.resolve(),
	handleLogout: () => {},
	authErrors: null,
	handleForgotPassword: (
		email: string,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {},
	handleSetCompanyCode: (companyCode: string) => {},
});

type Props = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const navigator =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { setCompany } = useCompany();

	const [user, setUser] = React.useState<TProfile | null>(null);
	const [loadingInitial, setLoadingInitial] = React.useState<boolean>(true);
	const [authErrors, setAuthErrors] = React.useState<Record<
		string,
		any
	> | null>(null);

	const handleUpdateUser = async <K extends keyof TProfile>(
		userid: string,
		key: K,
		value: TProfile[K]
	) => {
		updateUser(userid, key, value)
			.then(() => {
				setUser((prev) => {
					if (prev) {
						return {
							...prev,
							[key]: value,
						};
					}
					return null;
				});
			})
			.catch(console.error);
	};

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
		company: TCompany | null,
		fullName: string,
		jobType: string
	) => {
		setAuthErrors(null);
		return registerUser(
			name,
			email,
			password,
			profileImage,
			company,
			fullName,
			jobType
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

	const handleChangeProfilePic = async (image: string) => {
		if (!user) return;
		return await changeProfilePicture(image, user.uid);
	};

	const handleLogout = () => {
		auth.signOut();
		setUser(null);
		setAuthErrors(null);
		setCompany(null);
		clearFirebaseSubscriptions();
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

	const handleSetCompanyCode = async (companyCode: string) => {
		if (!user) return;
		await setCompanyCodeInProfile(user, companyCode);
	};

	React.useEffect(
		() =>
			onAuthStateChanged(
				auth,
				async (user) => {
					if (user) {
						setTimeout(async () => {
							const _user = await getProfile(user.uid);
							setUser({ ..._user, ...user } as TProfile);
							if (!_user?.companyInfo?.companyCode) return;
							const company = await getCompanyByCode(
								_user?.companyInfo?.companyCode
							);
							if (company) setCompany(company);
						}, 1000);
					} else {
						setUser(null);
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
			handleUpdateUser,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
			handleForgotPassword,
			handleChangeProfilePic,
			handleSetCompanyCode,
		}),
		[
			user,
			handleUpdateUser,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
			handleForgotPassword,
			handleChangeProfilePic,
			handleSetCompanyCode,
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
