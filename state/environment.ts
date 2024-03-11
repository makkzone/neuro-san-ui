/**
 * Zustand state store for "environment settings", like the backend API URL
 *
 */
import {create} from "zustand"

/**
 * State store interface
 */
interface EnvironmentStore {
    // URL for backend API calls. Retrieved from NodeJS backend by first page visited
    backendApiUrl: string
    setBackendApiUrl: (backendApiUrl: string) => void
}

/**
 * The hook that lets apps use the store
 */
const useEnvironmentStore = create<EnvironmentStore>((set) => ({
    backendApiUrl: null,
    setBackendApiUrl: (backendApiUrl: string) => set(() => ({backendApiUrl: backendApiUrl})),
}))

export default useEnvironmentStore
