const DEFAULT_DIMENSION = 32;

const normalize = (vector) => {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!magnitude) return vector;
  return vector.map((value) => value / magnitude);
};

const fallbackEmbedding = (text, dimensions = DEFAULT_DIMENSION) => {
  const output = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    output[i % dimensions] += Math.sin(code * 0.17) + Math.cos(code * 0.13);
  }
  return normalize(output);
};

export const createEmbedding = async (text) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const model = import.meta.env.VITE_GITHUB_EMBEDDING_MODEL || 'text-embedding-3-small';

  if (!token) {
    return fallbackEmbedding(text);
  }

  try {
    const response = await fetch('https://models.inference.ai.azure.com/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        input: text,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub Models request failed: ${response.status}`);
    }

    const payload = await response.json();
    const vector = payload?.data?.[0]?.embedding;
    if (!vector) throw new Error('Embedding not returned by GitHub Models');

    return normalize(vector);
  } catch (error) {
    console.warn('Falling back to local embedding due to API issue:', error);
    return fallbackEmbedding(text);
  }
};

export const cosineSimilarity = (left, right) => {
  const length = Math.min(left.length, right.length);
  let dot = 0;
  let leftMag = 0;
  let rightMag = 0;

  for (let i = 0; i < length; i += 1) {
    dot += left[i] * right[i];
    leftMag += left[i] * left[i];
    rightMag += right[i] * right[i];
  }

  if (!leftMag || !rightMag) return 0;
  return dot / (Math.sqrt(leftMag) * Math.sqrt(rightMag));
};
