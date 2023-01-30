import { useContext, useState } from 'react';
import { createContext } from 'react';

const TapsContext = createContext();

export const TapsProvider = ({ children }) => {
	const [taps, setTaps] = useState(undefined);

	return (
		<TapsContext.Provider value={{ taps: taps, setTaps: setTaps }}>
			{children}
		</TapsContext.Provider>
	);
};

export const useTaps = () => {
	return useContext(TapsContext);
};
