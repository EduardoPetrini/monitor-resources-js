// monitor only memory
import { monitorAll } from './index.js';
monitorAll({
  
  interval: 100,
  outputDir: 'temp-all',
  transformCpuValue: value => `${value} load`,
  transformMemoryValue: value => `${value} bytes`,
});

for (let i = 0; i < 100; i++) {
  await new Promise(resolve =>
    setTimeout(() => {
      console.log('doing something', i);
      resolve();
    }, 100)
  );
}
