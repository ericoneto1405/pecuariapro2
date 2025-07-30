import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { MapTrifold, Cow, Archive, CurrencyCircleDollar, Storefront, Flask, Factory, ShoppingCart, Bank, BookOpen, Users, Heart, Trophy, Certificate } from '@phosphor-icons/react';

function Sidebar() {
  const menuItems = [
    { path: '/', label: 'Mapa Geral', icon: <MapTrifold size={24} /> },
    { path: '/rebanhos', label: 'Meus Rebanhos', icon: <Cow size={24} /> },
    { path: '/inventario', label: 'Meu Inventário', icon: <Archive size={24} /> },
    { path: '/financeiro', label: 'Financeiro', icon: <CurrencyCircleDollar size={24} /> },
    { path: '/lojas-agropecuaria', label: 'Lojas de Agropecuária', icon: <Storefront size={24} /> },
    { path: '/centrais-semen', label: 'Centrais de Sêmen', icon: <Flask size={24} /> },
    { path: '/manejo-reprodutivo', label: 'Manejo Reprodutivo', icon: <Heart size={24} /> },
    { path: '/frigorificos', label: 'Frigoríficos', icon: <Factory size={24} /> },
    { path: '/exposicoes-e-pistas', label: 'Exposições e Pistas', icon: <ShoppingCart size={24} /> },
    { path: '/bancos-cooperativas', label: 'Bancos e Cooperativas', icon: <Bank size={24} /> },
    { path: '/senar-embrapa-sebrae', label: 'Senar / Embrapa / Sebrae', icon: <BookOpen size={24} /> },
    { path: '/fazendas-npcs', label: 'Fazendas NPCs', icon: <Users size={24} /> },
    { path: '/competicao', label: 'Competições', icon: <Trophy size={24} /> },
    { path: '/pista-de-validacao', label: 'Validação e Reputação', icon: <Certificate size={24} /> },
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
