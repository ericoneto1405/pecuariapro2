import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
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
