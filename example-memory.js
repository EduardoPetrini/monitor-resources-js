// monitor only memory
import { monitorMemory } from './index.js';
monitorMemory({
  interval: 100,
  outputDir: 'temp-mem',
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
