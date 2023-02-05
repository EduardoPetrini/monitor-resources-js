const resourceMonitor = ({ interval = 10000, firstMeasure, processFunction, transformValue = (_) => _ }) => {
  const { name } = processFunction;
  setInterval(() => {
    const currentResource = processFunction();
    const resourceDiff = {
      ...Object.keys(firstMeasure).reduce((previousCount, resourceField) => {
        return {
          ...previousCount,
          [resourceField]: firstMeasure[resourceField] - currentResource[resourceField],
        };
      }, {}),
    };

    const outputDiff = Object.keys(resourceDiff).reduce((previousText, resourceField) => {
      return `${previousText}${resourceField}: ${transformValue(resourceDiff[resourceField])} | `;
    }, "");

    const outputCurrent = Object.keys(currentResource).reduce((previousText, resourceField) => {
      return `${previousText}${resourceField}: ${transformValue(currentResource[resourceField])} | `;
    }, "");

    console.log("---");
    console.log(`Current ${name}: ${outputCurrent}`);
    console.log(`${name} diff since beginning: ${outputDiff}`);
  }, interval);
};

const monitorAll = ({ interval = 10000, transformMemoryValue, transformCpuValue } = {}) => {
  monitorMemory({ interval, transformMemoryValue });
  monitorCpu({ interval, transformCpuValue });
};

const monitorMemory = ({ interval = 5000, transformMemoryValue } = {}) => {
  let transformValue = transformMemoryValue;

  if (!transformMemoryValue) {
    transformValue = (value) => `${value / 1000000}Mb`;
  }

  const firstMemory = process.memoryUsage();

  resourceMonitor({ interval, firstMeasure: firstMemory, processFunction: process.memoryUsage, transformValue });
};

const monitorCpu = ({ interval = 10000, transformCpuValue = (_) => _ } = {}) => {
  const firstCpu = process.cpuUsage();

  resourceMonitor({ interval, firstMeasure: firstCpu, processFunction: process.cpuUsage, transformValue: transformCpuValue });
};

module.exports = {
  monitorMemory,
  monitorCpu,
  monitorAll,
};
