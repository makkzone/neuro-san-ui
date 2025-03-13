// eslint-disable-next-line no-shadow
export enum ZIndexLayers {
    LAYER_1 = 500,
    // MUI Drawer has a default z-index of 1200 and at least one of elements utilizing LAYER_2 is in an MUI Drawer
    LAYER_2 = 1500,
}
