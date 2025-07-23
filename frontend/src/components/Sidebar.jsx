import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { MapTrifold, Cow, Archive, CurrencyCircleDollar, Storefront, Flask, Factory, ShoppingCart, Bank, BookOpen } from '@phosphor-icons/react';

function Sidebar() {
  const menuItems = [
    { path: '/', label: 'Mapa Geral', icon: <MapTrifold size={24} /> },
    { path: '/rebanhos', label: 'Meus Rebanhos', icon: <Cow size={24} /> },
    { path: '/inventario', label: 'Meu Inventário', icon: <Archive size={24} /> },
    { path: '/financeiro', label: 'Financeiro', icon: <CurrencyCircleDollar size={24} /> },
    { path: '/lojas-agropecuaria', label: 'Lojas de Agropecuária', icon: <Storefront size={24} /> },
    { path: '/centrais-semen', label: 'Centrais de Sêmen', icon: <Flask size={24} /> },
    { path: '/frigorificos', label: 'Frigoríficos', icon: <Factory size={24} /> },
    { path: '/comercio-animais', label: 'Comércio de Animais', icon: <ShoppingCart size={24} /> },
    { path: '/bancos-cooperativas', label: 'Bancos e Cooperativas', icon: <Bank size={24} /> },
    { path: '/senar-embrapa-sebrae', label: 'Senar / Embrapa / Sebrae', icon: <BookOpen size={24} /> },
  ];

  return (
    <aside className="sidebar fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-4 md:w-20 md:p-2 lg:w-64 transition-all duration-300">
      <nav className="mt-16">
        <ul className="space-y-2 list-none pl-0 ml-0">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'active' : 'hover:bg-gray-700'
                  }`
                }
              >
                <span className="mr-3 md:mr-0 lg:mr-3">{item.icon}</span>
                <span className="md:hidden lg:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
