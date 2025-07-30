import { Routes, Route } from 'react-router-dom';
import MapaGeral from '../pages/MapaGeral';
import MeusRebanhos from '../pages/MeusRebanhos';
import MeuInventario from '../pages/MeuInventario';
import Financeiro from '../pages/Financeiro';
import LojasAgropecuaria from '../pages/LojasAgropecuaria';
import CentraisSemen from '../pages/CentraisSemen';
import Frigorificos from '../pages/Frigorificos';
import PistaDeValidacao from '../pages/PistaDeValidacao';
import BancosCooperativas from '../pages/BancosCooperativas';
import SenarEmbrapaSebrae from '../pages/SenarEmbrapaSebrae';
import FazendasNPCs from '../pages/FazendasNPCs';
import ManejoReprodutivo from '../pages/ManejoReprodutivo';
import Competicao from '../pages/Competicao';

// Dados mockados para teste do ManejoReprodutivo (usando IDs reais do backend)
const loteFemeasMock = [
  { animalId: 'MEST0002', ecc: 4.5, genetica: 'Boa' },
  { animalId: 'MEST0003', ecc: 3.5, genetica: 'Boa' },
  { animalId: 'MEST0004', ecc: 3.0, genetica: 'Regular' },
  { animalId: 'MEST0005', ecc: 4.0, genetica: 'Boa' },
  { animalId: 'MEST0006', ecc: 4.8, genetica: 'Elite' }
];

function MainContent() {
  return (
    <Routes>
      <Route path="/" element={<MapaGeral />} />
      <Route path="/rebanhos" element={<MeusRebanhos />} />
      <Route path="/inventario" element={<MeuInventario />} />
      <Route path="/financeiro" element={<Financeiro />} />
      <Route path="/lojas-agropecuaria" element={<LojasAgropecuaria />} />
      <Route path="/centrais-semen" element={<CentraisSemen />} />
      <Route path="/manejo-reprodutivo" element={<ManejoReprodutivo loteFemeas={loteFemeasMock} />} />
      <Route path="/frigorificos" element={<Frigorificos />} />
      <Route path="/exposicoes-e-pistas" element={<PistaDeValidacao />} />
      <Route path="/bancos-cooperativas" element={<BancosCooperativas />} />
      <Route path="/senar-embrapa-sebrae" element={<SenarEmbrapaSebrae />} />
      <Route path="/fazendas-npcs" element={<FazendasNPCs />} />
      <Route path="/competicao" element={<Competicao />} />
      <Route path="/pista-de-validacao" element={<PistaDeValidacao />} />
      <Route path="*" element={<div>Página não encontrada</div>} />
    </Routes>
  );
}

export default MainContent; 