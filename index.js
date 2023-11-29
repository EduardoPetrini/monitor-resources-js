import { getOutputStream } from './output.js';

export const resourceMonitor = async ({ outputStream, interval = 1000, firstMeasure, processFunction, transformValue = _ => _ }) => {
  let now = new Date().toLocaleString();
  const headers = Object.keys(firstMeasure)
    .reduce((previousText, resourceField) => {
      return `${previousText}${resourceField},`;
    }, '')
    .slice(0, -1);

  const first = Object.keys(firstMeasure)
    .reduce((previousText, resourceField) => {
      return `${previousText}${transformValue(firstMeasure[resourceField])},`;
    }, '')
    .slice(0, -1);

  let index = 1;
  outputStream.write(`type,ts,index,${headers}\n`);
  outputStream.write(`current,"${now}",${index},${first}\n`);
  setInterval(() => {
    index = index + 1;
    const currentResource = processFunction();
    const resourceDiff = {
      ...Object.keys(firstMeasure).reduce((previousCount, resourceField) => {
        return {
          ...previousCount,
          [resourceField]: firstMeasure[resourceField] - currentResource[resourceField],
        };
      }, {}),
    };

    now = new Date().toLocaleString();

    const outputDiff = Object.keys(resourceDiff)
      .reduce((previousText, resourceField) => {
        return `${previousText}${transformValue(resourceDiff[resourceField])},`;
      }, '')
      .slice(0, -1);

    const outputCurrent = Object.keys(currentResource)
      .reduce((previousText, resourceField) => {
        return `${previousText}${transformValue(currentResource[resourceField])},`;
      }, '')
      .slice(0, -1);

    outputStream.write(`current,"${now}",${index},${outputCurrent}\n`);
  }, interval);
};

export const monitorAll = ({ interval, outputDir, transformMemoryValue, transformCpuValue } = {}) => {
  monitorMemory({ interval, outputDir, transformMemoryValue });
  monitorCpu({ interval, outputDir, transformCpuValue });
};

export const monitorMemory = async ({ interval = 5000, outputDir = 'rs-monitor', transformMemoryValue = value => value / 1000000 } = {}) => {
  let transformValue = transformMemoryValue;

  const outputStream = await getOutputStream({ type: 'mem', outputDir });

  const firstMemory = process.memoryUsage();

  resourceMonitor({ outputStream, interval, firstMeasure: firstMemory, processFunction: process.memoryUsage, transformValue });
};

export const monitorCpu = async ({ interval = 10000, outputDir = 'rs-monitor', transformCpuValue = _ => _ } = {}) => {
  const firstCpu = process.cpuUsage();

  const outputStream = await getOutputStream({ type: 'cpu', outputDir });
  resourceMonitor({ outputStream, interval, firstMeasure: firstCpu, processFunction: process.cpuUsage, transformValue: transformCpuValue });
};
