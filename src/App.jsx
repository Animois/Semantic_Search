import { useEffect, useMemo, useState } from 'react';
import AuthScreen from './components/AuthScreen';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import { createEmbedding } from './lib/embedding';

const USER_KEY = 'semantic-search-users';
const DATASET_PATH = '/data/stackoverflow_3000.json';

const getStoredUsers = () => {
  if (typeof window === 'undefined') {
    return [{ userId: 'admin', password: 'admin123', role: 'admin' }];
  }

  const fallback = [{ userId: 'admin', password: 'admin123', role: 'admin' }];
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    localStorage.setItem(USER_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export default function App() {
  const [users, setUsers] = useState(getStoredUsers);
  const [activeUser, setActiveUser] = useState(null);
  const [dataset, setDataset] = useState([]);
  const [datasetError, setDatasetError] = useState('');
  const [isDatasetLoading, setIsDatasetLoading] = useState(true);

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const response = await fetch(DATASET_PATH);
        if (!response.ok) throw new Error(`Failed to load dataset (${response.status})`);
        const data = await response.json();
        setDataset(data);
      } catch (error) {
        setDatasetError(error.message);
      } finally {
        setIsDatasetLoading(false);
      }
    };

    loadDataset();
  }, []);

  const login = ({ userId, password }) => {
    const user = users.find((item) => item.userId === userId && item.password === password);
    if (!user) return { ok: false, message: 'Invalid credentials. Please try again.' };
    setActiveUser(user);
    return { ok: true };
  };

  const signUp = ({ userId, password, role }) => {
    const exists = users.some((item) => item.userId === userId);
    if (exists) return { ok: false, message: 'User ID already exists. Choose a different one.' };

    const nextUsers = [...users, { userId, password, role }];
    localStorage.setItem(USER_KEY, JSON.stringify(nextUsers));
    setUsers(nextUsers);
    setActiveUser({ userId, role, password });
    return { ok: true };
  };

  const logout = () => setActiveUser(null);

  const addRecord = async ({ question, answer, tags }) => {
    const embedding = await createEmbedding(question);
    const next = [{ id: crypto.randomUUID(), question, answer, tags, embedding }, ...dataset];
    setDataset(next);
  };

  const stats = useMemo(() => {
    const tagCount = dataset.reduce((acc, row) => acc + row.tags.length, 0);
    return {
      rows: dataset.length,
      avgTags: (tagCount / dataset.length || 0).toFixed(2),
    };
  }, [dataset]);

  if (isDatasetLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Loading semantic dataset...</h1>
          <p className="text-slate-400 mt-2">Please wait while we prepare 3000 programming records.</p>
        </div>
      </main>
    );
  }

  if (datasetError) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-6">
        <div className="max-w-xl text-center rounded-2xl border border-rose-400/40 bg-rose-400/10 p-6">
          <h1 className="text-2xl font-semibold text-rose-200">Dataset failed to load</h1>
          <p className="text-rose-100 mt-2">{datasetError}</p>
          <p className="text-slate-300 mt-4">Make sure `public/data/stackoverflow_3000.json` exists and restart the app.</p>
        </div>
      </main>
    );
  }

  if (!activeUser) {
    return <AuthScreen onLogin={login} onSignUp={signUp} />;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 text-slate-100 px-6 py-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-bold text-xl">Semantic Search Workspace</h1>
            <p className="text-sm text-slate-400">
              Logged in as <span className="text-cyan-300">{activeUser.userId}</span> ({activeUser.role})
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/10 px-3 py-2 rounded-lg">Rows: {stats.rows}</div>
            <div className="bg-white/10 px-3 py-2 rounded-lg">Avg tags: {stats.avgTags}</div>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeUser.role === 'admin' ? <AdminPanel dataset={dataset} addRecord={addRecord} /> : <UserPanel dataset={dataset} />}
      </div>
    </main>
  );
}
