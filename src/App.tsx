import { FC } from 'react';

const App: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Personality Quiz Hub</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-white text-center">
          <h2 className="text-5xl font-bold mb-4">Coming Soon</h2>
          <p className="text-xl opacity-90">Building your AI-powered personality quiz experience...</p>
        </div>
      </main>
    </div>
  );
};

export default App;
