/**
 * Utilities for dealing with enums.
 */

/**
 * Reverse lookup of enum key, given a value
 * @param myEnum The enum to look up
 * @param enumValue The value whose key we want
 * @return The key corresponding to <code>enuValue<code>> or <code>null</code> if not found.
 */
export function getEnumKeyByEnumValue(myEnum, enumValue) {
    const keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}
