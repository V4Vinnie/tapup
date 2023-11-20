import { VideoEditorModal } from 'react-native-videoeditorsdk';

export const VideoEditor = ({ visible, onFinish }) => {
	return (
		// Create the video editor modal and handle the export as well as any occuring errors.
		<VideoEditorModal
			// Add a video from the assets directory.
			video={require('../../assets/defaultvideo/LandOfLOve_VibeReel.mp4')}
			// Determine whether the editor should be visible or not.
			visible={true}
			onExport={(result) => {
				// The user exported a new video successfully and the newly generated video is located at `result.video`.
				console.log(result.video);
				onFinish();
			}}
			onCancel={() => {
				// The user tapped on the cancel button within the editor.
				onFinish();
			}}
			onError={(error) => {
				// There was an error generating the video.
				console.log(error);
				// onFinish();
			}}
		></VideoEditorModal>
	);
};
