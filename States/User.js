import { hookstate } from '@hookstate/core';
import { useHookstate } from '@hookstate/core';

const userState = hookstate({});
const wrapTapsState = (s) => ({
	get: () => s.value,
	set: (newUser) => s.set(newUser),
});

// The following 2 functions can be exported now:
export const accessGlobalState = () => wrapTapsState(userState);
export const useUserState = () => wrapTapsState(useHookstate(userState));
