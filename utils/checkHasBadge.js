export const checkHasBadge = (badgeId, userBadges) => {
	if (userBadges) {
		const hasBadge = userBadges.filter((badge) => badge.id === badgeId);
		return hasBadge.length >= 1;
	} else {
		return false;
	}
};
