import { useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import useGameTimeStore from './state/useGameTimeStore';

function App() {
  const fetchInitialTime = useGameTimeStore((state) => state.fetchInitialTime);

  useEffect(() => {
    fetchInitialTime();
  }, [fetchInitialTime]);

  return (
    <div className="app-layout">
      <Header />
      <div className="main-area">
        <Sidebar />
        <div className="main-content">
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default App;
