import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', paddingTop: '60px' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '240px', padding: '32px' }}>
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default App;
