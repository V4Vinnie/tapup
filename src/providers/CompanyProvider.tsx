import React, { useEffect, useMemo, useState } from 'react';
import { primaryColor } from '../utils/constants';
import { TCompany } from '../types';

const CompanyContext = React.createContext<{
	companyColor: string;
	setCompanyColor: React.Dispatch<React.SetStateAction<string>>;
	isCompanyColorSet: boolean;
	company: TCompany | null;
	setCompany: React.Dispatch<React.SetStateAction<TCompany | null>>;
}>({
	companyColor: primaryColor,
	setCompanyColor: () => {},
	isCompanyColorSet: false,
	company: null,
	setCompany: () => {},
});

type Props = {
	children: React.ReactNode;
};

export const CompanyProvider = ({ children }: Props) => {
	const [companyColor, setCompanyColor] = useState<string>(primaryColor);
	const [company, setCompany] = useState<TCompany | null>(null);
	const isCompanyColorSet = useMemo(
		() => companyColor !== primaryColor,
		[companyColor]
	);

	const companyProvProps = React.useMemo(
		() => ({
			companyColor,
			setCompanyColor,
			isCompanyColorSet,
			company,
			setCompany,
		}),
		[companyColor, setCompanyColor, isCompanyColorSet, company, setCompany]
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
