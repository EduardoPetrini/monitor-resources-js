import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

const DEFAULT_DIR = 'rs-monitor';

const verifyTheOutputFolders = async outputDir => {
  try {
    await fs.stat(outputDir);
  } catch (error) {
    await fs.mkdir(outputDir, { recursive: true });
  }
};

export const getOutputStream = async ({ type, outputDir = 'rs-monitor' }) => {
  let fullOutput = path.join(process.cwd(), outputDir);
  try {
    await verifyTheOutputFolders(fullOutput);
  } catch (error) {
    console.log(`the path '${fullOutput}' is invalid, using the default one: ${DEFAULT_DIR}`);
    fullOutput = path.join(process.cwd(), DEFAULT_DIR);
    await verifyTheOutputFolders(fullOutput);
  }

  const ts = Date.now();
  const filename = `output-${type}-${ts}.csv`;
  const filePath = path.join(fullOutput, filename);

  return fsSync.createWriteStream(filePath);
};
