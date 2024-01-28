/**
 * Zustand state store for "feature flags" like "demo mode", "generic branding".
 *
 */
import {create} from "zustand"

/**
 * Zustand state store for "feature flags" like "demo mode", "generic branding".
 */
interface FeaturesStore {
    // Demo users have access to in-development or incomplete features
    isDemoUser: boolean
    setIsDemoUser: (isDemo: boolean) => void

    // Generic branding for the entire app, if Cognizant branding is not desired
    isGeneric: boolean
    setIsGeneric: (isGeneric: boolean) => void

    // Whether to use next gen model serving
    useNextGenModelServing: boolean
    setUseNextGenModelServing: (useNextGenModelServing: boolean) => void
}

/**
 * The hook that lets apps use the store
 */
const useFeaturesStore = create<FeaturesStore>((set) => ({
    isDemoUser: false,
    setIsDemoUser: (isDemoUser) => set(() => ({isDemoUser: isDemoUser})),
    isGeneric: false,
    setIsGeneric: (isGeneric) => set(() => ({isGeneric: isGeneric})),
    useNextGenModelServing: false,
    setUseNextGenModelServing: (useNextGenModelServing) =>
        set(() => ({useNextGenModelServing: useNextGenModelServing})),
}))

export default useFeaturesStore
