import fs from 'node:fs/promises';
import path from 'node:path';

const OUTPUT_PATH = path.resolve('public/data/stackoverflow_3000.json');
const DATASET_URL =
  'https://datasets-server.huggingface.co/rows?dataset=MartinElMolon%2Fstackoverflow_preguntas_con_embeddings&config=default&split=train&offset=0&length=3000';

const normalize = (vector) => {
  const mag = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!mag) return vector;
  return vector.map((value) => Number((value / mag).toFixed(8)));
};

const fallbackEmbedding = (text, dimensions = 32) => {
  const output = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    output[i % dimensions] += Math.sin(code * 0.17) + Math.cos(code * 0.13);
  }
  return normalize(output);
};

const baseRecords = [
  {
    question: 'How to declare array in python?',
    answer: 'Use a list: numbers = [1, 2, 3]. For numeric arrays, use NumPy: np.array([1, 2, 3]).',
    tags: ['python', 'arrays'],
  },
  {
    question: 'How to do binary search in cpp?',
    answer: 'Use std::binary_search with sorted data or implement while(left <= right) with mid index.',
    tags: ['cpp', 'algorithms', 'binary-search'],
  },
  {
    question: 'How to reverse a linked list in Java?',
    answer: 'Track prev, current, next pointers and reverse links iteratively in O(n).',
    tags: ['java', 'linked-list'],
  },
  {
    question: 'What is a promise in JavaScript?',
    answer: 'A Promise represents async result states: pending, fulfilled, or rejected.',
    tags: ['javascript', 'async-await'],
  },
  {
    question: 'How to connect PostgreSQL in Node.js?',
    answer: 'Install pg package, create Pool with connection string, and call pool.query().',
    tags: ['node.js', 'postgresql'],
  },
  {
    question: 'How to create API endpoint in Express?',
    answer: 'Use app.get/post methods and return JSON response from route handlers.',
    tags: ['express', 'api'],
  },
];

const generateFallbackDataset = () => {
  const rows = [];
  for (let i = 0; i < 3000; i += 1) {
    const base = baseRecords[i % baseRecords.length];
    const question = `${base.question} (variation ${i + 1})`;
    rows.push({
      id: `fallback-${i + 1}`,
      question,
      answer: `${base.answer} Example id: ${i + 1}.`,
      tags: [...base.tags],
      embedding: fallbackEmbedding(question),
    });
  }
  return rows;
};

const fromHfResponse = (payload) => {
  const rows = payload?.rows ?? [];
  return rows.map((row, index) => {
    const item = row.row ?? row;
    return {
      id: item.id?.toString() ?? `hf-${index + 1}`,
      question: item.question ?? item.pregunta ?? 'Untitled question',
      answer: item.answer ?? item.respuesta ?? 'No answer provided',
      tags: Array.isArray(item.tags) ? item.tags : [],
      embedding: Array.isArray(item.embedding)
        ? normalize(item.embedding.map((v) => Number(v)))
        : fallbackEmbedding(item.question ?? `sample-${index + 1}`),
    };
  });
};

const run = async () => {
  let records;

  try {
    const response = await fetch(DATASET_URL);
    if (!response.ok) {
      throw new Error(`Dataset request failed: ${response.status}`);
    }
    const payload = await response.json();
    records = fromHfResponse(payload);

    if (!records.length) {
      throw new Error('No rows returned by Hugging Face dataset endpoint.');
    }

    if (records.length < 3000) {
      console.warn(`Only ${records.length} rows returned; padding to 3000 with fallback records.`);
      const fallback = generateFallbackDataset();
      records = [...records, ...fallback.slice(0, 3000 - records.length)];
    }

    records = records.slice(0, 3000);
    console.log('Fetched rows from Hugging Face dataset endpoint.');
  } catch (error) {
    console.warn('Using fallback generated dataset because download failed.');
    console.warn(error.message);
    records = generateFallbackDataset();
  }

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(records, null, 2)}\n`, 'utf-8');
  console.log(`Saved ${records.length} rows to ${OUTPUT_PATH}`);
};

run();
