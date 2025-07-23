import { Routes, Route } from 'react-router-dom';
import MapaGeral from '../pages/MapaGeral';
import MeusRebanhos from '../pages/MeusRebanhos';
import MeuInventario from '../pages/MeuInventario';
import Financeiro from '../pages/Financeiro';
import LojasAgropecuaria from '../pages/LojasAgropecuaria';
import CentraisSemen from '../pages/CentraisSemen';
import Frigorificos from '../pages/Frigorificos';
import ComercioAnimais from '../pages/ComercioAnimais';
import BancosCooperativas from '../pages/BancosCooperativas';
import SenarEmbrapaSebrae from '../pages/SenarEmbrapaSebrae';

function MainContent() {
  return (
    <Routes>
      <Route path="/" element={<MapaGeral />} />
      <Route path="/rebanhos" element={<MeusRebanhos />} />
      <Route path="/inventario" element={<MeuInventario />} />
      <Route path="/financeiro" element={<Financeiro />} />
      <Route path="/lojas-agropecuaria" element={<LojasAgropecuaria />} />
      <Route path="/centrais-semen" element={<CentraisSemen />} />
      <Route path="/frigorificos" element={<Frigorificos />} />
      <Route path="/comercio-animais" element={<ComercioAnimais />} />
      <Route path="/bancos-cooperativas" element={<BancosCooperativas />} />
      <Route path="/senar-embrapa-sebrae" element={<SenarEmbrapaSebrae />} />
    </Routes>
  );
}

export default MainContent; 