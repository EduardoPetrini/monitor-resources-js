# JS Resource Monitor
This package is meant to monitor the resources used by the JavaScript application.

# Install
`npm i monitor-resources-js`

# Usage

## Monitor Memory
```
const {monitorMemory} = require("monitor-resources-js");
...

monitorMemory(options);
```

## Monitor CPU
```
const {monitorCpu} = require("monitor-resources-js");
...

monitorCpu(options);
```

## Monitor both Memory and CPU
```
const {monitorAll} = require("monitor-resources-js");
...

monitorAll(options);
```

# options
 - `interval`: in milliseconds to monitor and print the resource consumption: default 5000
 - `transformMemoryValue`: function to apply some extra calc or transformation on memory measurements: default `(value) => (value / 1000000) + "Mb"`
 - `transformCpuValue`: function to apply some extra calc or transformation on CPU measurements: default `(_) => _`

# Source
[EduardoPetrini/monitor-resources-js](https://github.com/EduardoPetrini/monitor-resources-js)
