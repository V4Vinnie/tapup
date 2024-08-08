import React, { useEffect, useMemo, useState } from 'react';
import { primaryColor } from '../utils/constants';
import { TCompany } from '../types';
import { setCompanyCodeInProfile } from '../database/services/UserService';

const CompanyContext = React.createContext<{
	companyColor: string;
	isCompanyColorSet: boolean;
	company: TCompany | null;
	setCompany: React.Dispatch<React.SetStateAction<TCompany | null>>;
	setCompanyColor: React.Dispatch<React.SetStateAction<string>>;
}>({
	companyColor: primaryColor,
	isCompanyColorSet: false,
	company: null,
	setCompany: () => {},
	setCompanyColor: () => {},
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

	useEffect(() => {
		if (company) {
			setCompanyColor(company.primaryColor);
		} else {
			setCompanyColor(primaryColor);
		}
	}, [company]);

	const companyProvProps = React.useMemo(
		() => ({
			companyColor,
			isCompanyColorSet,
			company,
			setCompany,
			setCompanyColor,
		}),
		[companyColor, isCompanyColorSet, company, setCompany, setCompanyColor]
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
