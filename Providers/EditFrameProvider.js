import { useContext, useState } from 'react';
import { createContext } from 'react';

const EditorFrameContext = createContext();

export const EditorFrameProvider = ({ children }) => {
	const [editorFrame, setEditorFrame] = useState(undefined);

	return (
		<EditorFrameContext.Provider
			value={{ editorFrame: editorFrame, setEditorFrame: setEditorFrame }}
		>
			{children}
		</EditorFrameContext.Provider>
	);
};

export const useEditorFrame = () => {
	return useContext(EditorFrameContext);
};
