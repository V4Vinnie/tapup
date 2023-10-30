import { createContext, useContext, useState } from 'react';

const SetNavBarContext = createContext();

export const SetNavBarProvider = ({ children }) => {
	const [showNavBar, setShowNavBar] = useState(true);

	return (
		<SetNavBarContext.Provider
			value={{ showNavBar: showNavBar, setShowNavBar: setShowNavBar }}
		>
			{children}
		</SetNavBarContext.Provider>
	);
};

export const useSetNavBar = () => {
	return useContext(SetNavBarContext);
};
