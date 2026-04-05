import { useState } from 'react';
import { createEmbedding } from '../lib/embedding';
import { semanticSearch } from '../lib/search';

export default function UserPanel({ dataset }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const submitSearch = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    const embedding = await createEmbedding(question.trim());
    const ranked = semanticSearch({ queryEmbedding: embedding, dataset, topK: 5 });
    setResults(ranked);
    setLoading(false);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900">Ask your programming question</h2>
        <p className="mt-2 text-slate-600">Examples: “How to declare array in python”, “How to do binary search in cpp”.</p>

        <form onSubmit={submitSearch} className="mt-6">
          <div className="rounded-2xl border-2 border-cyan-400 p-2 bg-cyan-50">
            <textarea
              className="w-full min-h-36 p-4 rounded-xl resize-y outline-none bg-white"
              placeholder="Type your programming question here..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <div className="flex justify-end p-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? 'Searching...' : 'Find Best Match'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {results.map((row, index) => (
          <article key={row.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center gap-2">
              <h3 className="font-semibold text-slate-900">Result #{index + 1}</h3>
              <span className="text-sm font-medium text-cyan-700 bg-cyan-100 px-2 py-1 rounded-lg">
                Similarity: {(row.similarity * 100).toFixed(2)}%
              </span>
            </div>
            <p className="text-slate-900 mt-3">{row.question}</p>
            <pre className="mt-3 bg-slate-900 text-cyan-100 text-sm rounded-xl p-4 overflow-x-auto">{row.answer}</pre>
            <div className="text-xs mt-2 text-slate-500">Tags: {row.tags.join(', ')}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
