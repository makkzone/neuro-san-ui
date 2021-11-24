// Miscellaneous object transformation utilities

// Utility routine to remove unchecked properties from an object and return a new object with only the "truthy"
// properties.
// Courtesy: https://stackoverflow.com/a/56081419
export default function getCheckedOnly(obj: Object) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, val]) => val));
}
