export const findById = (arr, id) => arr.filter((item) => item.id === id);

export const findWatchedFrameById = (arr, id) =>
	arr.filter((item) => item.topicId === id);

export const findWatchedFrameIndex = (arr, id) => {
	for (let i = 0; i < arr.length; i++) {
		const watchedFrame = arr[i];
		if (watchedFrame.id === id) {
			return i;
		}
	}
};
