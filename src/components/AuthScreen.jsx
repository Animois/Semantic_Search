import { useState } from 'react';

const initialForm = {
  userId: '',
  password: '',
  role: 'user',
};

export default function AuthScreen({ onLogin, onSignUp }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    const action = mode === 'login' ? onLogin : onSignUp;

    const result = action(form);
    if (!result.ok) {
      setError(result.message);
    } else {
      setForm(initialForm);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Semantic Programming Search</h1>
        <p className="text-slate-300 mb-8">Ask programming questions and get the best semantic match instantly.</p>

        <div className="flex gap-3 mb-6">
          <button
            className={`px-4 py-2 rounded-xl font-medium ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'bg-white/10'}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-medium ${mode === 'signup' ? 'bg-cyan-500 text-slate-950' : 'bg-white/10'}`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label htmlFor="userId" className="block text-sm mb-1 text-slate-300">User ID</label>
            <input
              id="userId"
              value={form.userId}
              onChange={(event) => setForm((prev) => ({ ...prev, userId: event.target.value.trim() }))}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 outline-none focus:border-cyan-400"
              placeholder="e.g. dev_akash"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-slate-300">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 outline-none focus:border-cyan-400"
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="role" className="block text-sm mb-1 text-slate-300">Account type</label>
              <select
                id="role"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 outline-none focus:border-cyan-400"
              >
                <option value="user">User panel</option>
                <option value="admin">Admin panel</option>
              </select>
            </div>
          )}

          {error && <p className="text-rose-300 text-sm">{error}</p>}

          <button className="w-full py-3 rounded-xl bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 transition-colors" type="submit">
            {mode === 'login' ? 'Login to Continue' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
