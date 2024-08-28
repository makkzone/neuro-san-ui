// Mock Fetch for NodeJs environment
export const mockFetch = (data) => {
    return jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => data,
        })
    )
}
