import { ROLES } from '../Constants/Roles';

export const checkIfCreator = (userRole) => {
	if (userRole === ROLES.ADMIN || userRole === ROLES.CREATOR) {
		return true;
	} else {
		return false;
	}
};
