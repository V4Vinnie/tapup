import { TCompany, TProfile } from '../types';
import { useNavigation } from '@react-navigation/native';
import {
	UserCredential,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../database/Firebase';
import {
	deleteMyAccount,
	//changeProfilePicture,
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
import { clearFirebaseSubscriptions } from '../utils/firebaseSubscriptions';
import { useTaps } from './TapProvider';
import { useTopics } from './TopicProvider';

const initialState = {
	loadingInitial: true,
	user: null,
	handleUpdateUser: () => {},
	//handleChangeProfilePic: () => Promise.resolve(''),
	handleLogin: () => Promise.resolve(),
	handleSignup: () => Promise.resolve(),
	handleLogout: () => {},
	authErrors: null,
	handleForgotPassword: () => {},
	handleSetCompanyCode: () => {},
	handleRemoveAccount: () => {},
};

const AuthContext = React.createContext<{
	loadingInitial: boolean;
	user: TProfile | null;
	handleUpdateUser: <K extends keyof TProfile>(
		userid: string,
		key: K,
		value: TProfile[K]
	) => void;
	//handleChangeProfilePic: (image: string) => Promise<string | undefined>;
	handleLogin: (
		email: string,
		password: string
	) => Promise<UserCredential | void>;
	handleSignup: (
		name: string,
		email: string,
		password: string,
		//profileImage: string,
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
	handleRemoveAccount: (mail: string, password: string) => void;
}>(initialState);

type Props = {
	children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
	const navigator =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();
	const { setCompany, resetState: resetCompanyState } = useCompany();

	const [user, setUser] = React.useState<TProfile | null>(initialState.user);
	const [loadingInitial, setLoadingInitial] = React.useState<boolean>(
		initialState.loadingInitial
	);
	const [authErrors, setAuthErrors] = React.useState<Record<
		string,
		any
	> | null>(initialState.authErrors);

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
		loginUser(email, password)
			.then(async (_user) => {
				setUser(_user);
				if (!_user?.companyInfo?.companyCode) return;
				const company = await getCompanyByCode(
					_user?.companyInfo?.companyCode
				);
				if (company) setCompany(company);
				setLoadingInitial(false);
			})
			.catch(() =>
				setAuthErrors({
					message: 'Invalid email or password',
				})
			);
	};

	const handleSignup = async (
		name: string,
		email: string,
		password: string,
		//profileImage: string,
		company: TCompany | null,
		fullName: string,
		jobType: string
	) => {
		setAuthErrors(null);
		return registerUser(
			name,
			email,
			password,
			//profileImage,
			company,
			fullName,
			jobType
		)
			.then((user) => {
				setUser(user);
			})
			.catch((errors) =>
				setAuthErrors({
					userDetails: {
						message: errors,
					},
				})
			);
	};

	//	const handleChangeProfilePic = async (image: string) => {
	//		if (!user) return;
	//		return await changProfilePicture(image, user.uid);
	//	}

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

	const resetState = () => {
		setUser(initialState.user);
		setAuthErrors(initialState.authErrors);
		setLoadingInitial(initialState.loadingInitial);
	};

	const handleRemoveAccount = (mail: string, password: string) => {
		signInWithEmailAndPassword(auth, mail, password).then(() => {
			deleteMyAccount().then(() => handleLogout());
		});
	};

	React.useEffect(
		() =>
			onAuthStateChanged(
				auth,
				async (user) => {
					if (user) {
						const _user = await getProfile(user.uid);
						setUser({ ..._user, ...user } as TProfile);
						setLoadingInitial(false);
						if (!_user?.companyInfo?.companyCode) return;
						const company = await getCompanyByCode(
							_user?.companyInfo?.companyCode
						);
						if (company) setCompany(company);
					} else {
						setUser(null);
						setLoadingInitial(false);
					}
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
			loadingInitial,
			user,
			handleUpdateUser,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
			handleForgotPassword,
			//handleChangeProfilePic,
			handleSetCompanyCode,
			handleRemoveAccount,
		}),
		[
			loadingInitial,
			user,
			handleUpdateUser,
			handleLogin,
			handleSignup,
			handleLogout,
			authErrors,
			handleForgotPassword,
			//handleChangeProfilePic,
			handleSetCompanyCode,
			handleRemoveAccount,
		]
	);

	return (
		<AuthContext.Provider value={authProperties}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return React.useContext(AuthContext);
};
