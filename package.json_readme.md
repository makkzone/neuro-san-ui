# Documentation for package.json

Comments aren't allowed in JSON files, so this file is for documenting package.json.

1) We have an old version of react-flow-renderer (v9 vs current vendor v11) which pins us to old dependencies. For
example this version of react-flow-renderer depends on an older version of D3.js which conflicts with the newer
version that nivo/line would like to have.
1) `warning Resolution field "@types/react@17.0.2" is incompatible with requested version "@types/react@^16.9.5"`

    This is due to a [bug](https://github.com/segmentio/evergreen/issues/1291) in Evergreen packaging. It can be ignored
since, as the Evergreen vendor points out, it's just an incorrect declaration.
1) nivo also has issues with using older versions of D3.js: https://github.com/plouc/nivo/issues/2133
1) Why do we need echarts-gl? ECharts depends on it for 3D plots (but for some reason doesn't declare it as a dependency)
Link (use Google translate!) https://blog.csdn.net/RubyLinT/article/details/109100726