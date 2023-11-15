import { getOutputStream } from './output.js';

export const resourceMonitor = async ({ outputStream, interval = 1000, firstMeasure, processFunction, transformValue = _ => _ }) => {
  const { name } = processFunction;

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

  outputStream.write(`type,ts,${headers}\n`);
  outputStream.write(`current,"${now}",${first}\n`);
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

    // outputStream.write(`diff,"${now}",${outputDiff}\n`);
    outputStream.write(`current,"${now}",${outputCurrent}\n`);
    // console.log('---');
    // console.log(`Current ${name}: ${outputCurrent}`);
    // console.log(`${name} diff since beginning: ${outputDiff}`);
  }, interval);
};

export const monitorAll = ({ interval = 10000, transformMemoryValue, transformCpuValue } = {}) => {
  monitorMemory({ interval, transformMemoryValue });
  monitorCpu({ interval, transformCpuValue });
};

export const monitorMemory = async ({ interval = 5000, transformMemoryValue } = {}) => {
  let transformValue = transformMemoryValue;

  if (!transformMemoryValue) {
    transformValue = value => value / 1000000;
  }

  const outputStream = await getOutputStream({ type: 'mem' });

  const firstMemory = process.memoryUsage();

  resourceMonitor({ outputStream, interval, firstMeasure: firstMemory, processFunction: process.memoryUsage, transformValue });
};

const monitorCpu = async ({ interval = 10000, transformCpuValue = _ => _ } = {}) => {
  const firstCpu = process.cpuUsage();

  const outputStream = await getOutputStream({ type: 'cpu' });
  resourceMonitor({ outputStream, interval, firstMeasure: firstCpu, processFunction: process.cpuUsage, transformValue: transformCpuValue });
};

