# Documentation for package.json

Comments aren't allowed in JSON files, so this file is for documenting package.json.

1. Why do we need echarts-gl? ECharts depends on it for 3D plots (but for some reason doesn't declare it as a dependency)
   Link (use Google translate!) https://blog.csdn.net/RubyLinT/article/details/109100726
1. These warnings on `yarn install`:
    ```
    warning @blueprintjs/core > popper.js@1.16.1: You can find the new Popper v2 at @popperjs/core, this package is dedicated to the legacy v1
    warning @blueprintjs/core > react-popper > popper.js@1.16.1: You can find the new Popper v2 at @popperjs/core, this package is dedicated to the legacy v1
    warning " > react-simple-chatbot@0.6.1" has incorrect peer dependency "styled-components@^4.0.0".
    warning " > react-simple-chatbot@0.6.1" has incorrect peer dependency "react@^16.3.0".
    warning " > react-simple-chatbot@0.6.1" has incorrect peer dependency "react-dom@^16.3.0".
    ```
    See: https://github.com/palantir/blueprint/issues/5500 and https://github.com/palantir/blueprint/wiki/Popover2-migration
    blueprintjs is in transition to 5.0. Once they release it and we migrate to that, it should be fine.
    react-simple-chatbot hasn't been updated in 5 years. It still has dependency to react 16 and styled-components @4,
    while nextfront is already on react 18 and styled-compnents 5. These warnings can be ignored for now.
1. "sharp" -- required by NextJS. See: https://nextjs.org/docs/messages/sharp-missing-in-production
1. "csstype": "<3.1.3" -- see https://github.com/emotion-js/emotion/issues/3136 and
   https://github.com/frenic/csstype/issues/189 for the issues with version 3.1.3 of this library
