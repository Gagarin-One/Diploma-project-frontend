import { useNavigate, useLocation } from 'react-router-dom';
import s from './FarmerNavHeader.module.scss';

const FarmerNavHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToOrders = () => navigate('/farmer/orders');
  const goToProducts = () => navigate('/farmer/products');
  const goToAddProducts = () => navigate('/farmer/products/add');

  return (
    <div className={s.headerWrapper}>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/orders' ? s.active : ''}`}
        onClick={goToOrders}
      >
        Мои заказы
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/products' ? s.active : ''}`}
        onClick={goToProducts}
      >
        Мои товары
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/products/add' ? s.active : ''}`}
        onClick={goToAddProducts}
      >
        Добавить товар
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/products' ? s.active : ''}`}
        onClick={goToProducts}
      >
        Мои отзывы
      </button>
    </div>
  );
};

export default FarmerNavHeader;
