import { useNavigate, useLocation } from 'react-router-dom';
import s from './FarmerNavHeader.module.scss';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { clearFarmerNotifications, fetchFarmerNotifications } from '../../pages/farmer/farmerSlise';

const FarmerNavHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToOrders = () => navigate('/farmer/orders');
  const goToProducts = () => navigate('/farmer/products');
  const goToAddProducts = () => navigate('/farmer/products/add');
  const goToReviews = () => navigate('/farmer/reviews');
  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.farmerSlise.notifications);
  const loading = useAppSelector((state) => state.farmerSlise.loading);
  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (token) {
      dispatch(fetchFarmerNotifications());
    }
  }, [dispatch]);
  const handleClear = async () => {
    const token = Cookies.get('farmerToken');
    if (token) {
      const { id } = jwtDecode<{ id: number }>(token);
      await dispatch(clearFarmerNotifications(id));
    }
  };
  return (
    <div className={s.headerWrapper}>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/orders' ? s.active : ''}`}
        onClick={goToOrders}>
        Мои заказы
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/products' ? s.active : ''}`}
        onClick={goToProducts}>
        Мои товары
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/products/add' ? s.active : ''}`}
        onClick={goToAddProducts}>
        Добавить товар
      </button>
      <button
        className={`${s.navButton} ${location.pathname === '/farmer/reviews' ? s.active : ''}`}
        onClick={goToReviews}>
        Мои отзывы
      </button>
      {notifications.length > 0 && (
        <div className={s.notification}>
          <span>У вас новый заказ! Проверьте список заказов!</span>
          <button onClick={handleClear}>Понятно</button>
        </div>
      )}
    </div>
  );
};

export default FarmerNavHeader;
