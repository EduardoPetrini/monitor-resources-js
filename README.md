# JS Resource Monitor
This npm package is designed to monitor the resources utilized by a JavaScript application. It captures resource metrics at specific intervals and stores the results in CSV format realtime.

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
  - `interval`: Time interval in milliseconds to monitor and log resource consumption (default: `5000`).
  - `outputDir`: Output directory to save the CSV file with resource consumption (default: `rs-monitor`).
  - `transformMemoryValue`: Function to apply additional calculations or transformations on memory measurements (default: `(value) => value / 1000000`).
  - `transformCpuValue`: Function to apply additional calculations or transformations on CPU measurements (default: `(_) => _`).

# Source
[EduardoPetrini/monitor-resources-js](https://github.com/EduardoPetrini/monitor-resources-js)
