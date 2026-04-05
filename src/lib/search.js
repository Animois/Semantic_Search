import { cosineSimilarity } from './embedding';

export const semanticSearch = ({ queryEmbedding, dataset, topK = 5 }) => {
  const ranked = dataset
    .map((row) => ({
      ...row,
      similarity: cosineSimilarity(queryEmbedding, row.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return ranked;
};
