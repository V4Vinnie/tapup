export const formatDate = (dateToFromat) => {
	if (dateToFromat instanceof Date) {
		return dateToFromat;
	} else if (dateToFromat.toDate()) {
		return dateToFromat.toDate();
	}
};
