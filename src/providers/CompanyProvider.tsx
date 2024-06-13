import React, { useEffect, useMemo, useState } from 'react';
import { primaryColor } from '../utils/constants';

const CompanyContext = React.createContext<{
	companyColor: string;
	setCompanyColor: React.Dispatch<React.SetStateAction<string>>;
	isCompanyColorSet: boolean;
}>({
	companyColor: primaryColor,
	setCompanyColor: () => {},
	isCompanyColorSet: false,
});

type Props = {
	children: React.ReactNode;
};

export const CompanyProvider = ({ children }: Props) => {
	const [companyColor, setCompanyColor] = useState<string>(primaryColor);
	const isCompanyColorSet = useMemo(
		() => companyColor !== primaryColor,
		[companyColor]
	);

	const companyProvProps = React.useMemo(
		() => ({
			companyColor,
			setCompanyColor,
			isCompanyColorSet,
		}),
		[companyColor, setCompanyColor, isCompanyColorSet]
	);

	return (
		<CompanyContext.Provider value={companyProvProps}>
			{children}
		</CompanyContext.Provider>
	);
};

export const useCompany = () => {
	return React.useContext(CompanyContext);
};
