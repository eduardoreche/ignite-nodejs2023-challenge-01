import fs from 'node:fs';
import { parse } from 'csv-parse';

const importFilePath = new URL('../initial_data.csv', import.meta.url);

const importDataStream = fs.createReadStream(importFilePath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
});

async function importData() {
  const fileData = importDataStream.pipe(csvParse);

  for await (const line of fileData) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
}

importData();
