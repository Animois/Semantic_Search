import { useMemo, useState } from 'react';

const emptyRecord = {
  question: '',
  answer: '',
  tags: '',
};

export default function AdminPanel({ dataset, addRecord }) {
  const [form, setForm] = useState(emptyRecord);

  const recentRows = useMemo(() => dataset.slice(0, 8), [dataset]);

  const submit = (event) => {
    event.preventDefault();
    addRecord({
      question: form.question,
      answer: form.answer,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });
    setForm(emptyRecord);
  };

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900">Admin Panel</h2>
        <p className="mt-2 text-slate-600">Manage indexed programming Q/A records.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <input
            value={form.question}
            onChange={(event) => setForm((prev) => ({ ...prev, question: event.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300"
            placeholder="Question"
            required
          />
          <textarea
            value={form.answer}
            onChange={(event) => setForm((prev) => ({ ...prev, answer: event.target.value }))}
            className="w-full px-4 py-3 min-h-32 rounded-xl border border-slate-300"
            placeholder="Best answer/code"
            required
          />
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300"
            placeholder="Tags, comma-separated"
          />
          <button className="w-full py-3 rounded-xl bg-cyan-500 text-slate-900 font-semibold" type="submit">
            Add to Dataset
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Latest Indexed Rows</h3>
        <ul className="space-y-3 max-h-[500px] overflow-auto pr-1">
          {recentRows.map((row) => (
            <li key={row.id} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium text-slate-800">{row.question}</p>
              <p className="text-sm text-slate-500 mt-1">{row.tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
