/*
Unit tests for the "file" utility module
 */

import { toSafeFilename } from "../utils/file"

describe("toSafeFilename", () => {
    it("should replace non-alphanumeric characters with underscores", () => {
        expect(toSafeFilename("my cool file!")).toBe("my_cool_file")
        expect(toSafeFilename("Hello, world!")).toBe("Hello__world")
        expect(toSafeFilename("The quick brown fox jumps over the lazy dog")).toBe("The_quick_brown_fox_jumps_over_the_lazy_dog")
    })

    it("should trim leading and trailing underscores", () => {
        expect(toSafeFilename("_my cool file_")).toBe("my_cool_file")
        expect(toSafeFilename("__Hello, world!__")).toBe("Hello__world")
        expect(toSafeFilename("__The quick brown fox jumps over the lazy dog__")).toBe("The_quick_brown_fox_jumps_over_the_lazy_dog")
    })

    it("should handle empty or null strings", () => {
        expect(toSafeFilename("")).toBe("")
        expect(toSafeFilename(null)).toBe("")
    })
})