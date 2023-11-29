// monitor only memory
import { monitorCpu } from './index.js';
monitorCpu({
  
  interval: 100,
  outputDir: 'temp-cpu',
  transformCpuValue: value => `${value} load`,
});

for (let i = 0; i < 100; i++) {
  await new Promise(resolve =>
    setTimeout(() => {
      console.log('doing something', i);
      resolve();
    }, 100)
  );
}
