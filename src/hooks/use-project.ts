import { createContext, useContext } from "react";

export interface ProjectContextType {
	projectName: string;
	disableAuth: boolean;
}

export const ProjectContext = createContext<ProjectContextType>({
	projectName: "",
	disableAuth: false,
});

export const useProject = () => {
	return useContext(ProjectContext);
};
