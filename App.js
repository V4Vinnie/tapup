import { LogBox } from 'react-native';
import { TapsProvider } from './Providers/TapsProvider';
import { UserProvider } from './Providers/UserProvider';
import { AppRoutes } from './Views/AppRoutes';

LogBox.ignoreAllLogs();

export default function App() {
	return (
		<UserProvider>
			<TapsProvider>
				<AppRoutes />
			</TapsProvider>
		</UserProvider>
	);
}
