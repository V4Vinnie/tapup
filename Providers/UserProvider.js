import { useContext, useState } from 'react';
import { createContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);

	return (
		<UserContext.Provider value={{ user: user, setUser: setUser }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	return useContext(UserContext);
};
