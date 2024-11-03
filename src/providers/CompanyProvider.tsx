import React, { useEffect, useMemo, useState } from 'react';
import { primaryColor } from '../utils/constants';
import { TCompany } from '../types';

const companyInitial = {
	companyColor: primaryColor,
	isCompanyColorSet: false,
	company: null,
	setCompany: () => {},
	setCompanyColor: () => {},
	resetState: () => {},
};

const CompanyContext = React.createContext<{
	companyColor: string;
	isCompanyColorSet: boolean;
	company: TCompany | null;
	setCompany: React.Dispatch<React.SetStateAction<TCompany | null>>;
	setCompanyColor: React.Dispatch<React.SetStateAction<string>>;
	resetState: () => void;
}>(companyInitial);

type Props = {
	children: React.ReactNode;
};

export const CompanyProvider = ({ children }: Props) => {
	const [companyColor, setCompanyColor] = useState<string>(
		companyInitial.companyColor
	);
	const [company, setCompany] = useState<TCompany | null>(
		companyInitial.company
	);
	const isCompanyColorSet = useMemo(
		() => companyColor !== primaryColor,
		[companyColor]
	);

	const resetState = () => {
		setCompany(companyInitial.company);
		setCompanyColor(companyInitial.companyColor);
	};

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
			resetState,
		}),
		[
			companyColor,
			isCompanyColorSet,
			company,
			setCompany,
			setCompanyColor,
			resetState,
		]
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
