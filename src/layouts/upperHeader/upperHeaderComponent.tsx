import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import s from './upperHeader.module.scss';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const UpperHeader: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated);
  
  // Пробуем взять токен фермера или пользователя
  const path = window.location.pathname;
  const tokenName = path.startsWith('/farmer') ? 'farmerToken' : 'userToken';
  const token = Cookies.get(tokenName);

  let username = '';

  if (token) {
    try {
      const decoded = jwtDecode<{ id: number; username: string }>(token);
      username = decoded.username;
    } catch (error) {
      console.error('Ошибка декодирования токена:', error);
      Cookies.remove('farmerToken');
      Cookies.remove('userToken');
    }
  }

  return (
    <div className={s.headerContainer}>
      <div className={s.header}>
        {isAuthenticated ? <h3>{username}</h3> : <Link to="/login">войти</Link>}
        <div className={s.emptyWrapper}>
          <h3>
            <Link to="/basket" className={s.emptyButton}>
              Корзина
            </Link>
          </h3>
          <h3>
          <Link to="/orders" className={s.emptyButton}>
              Мои заказы
            </Link>
          </h3>
      
        </div>
      </div>
    </div>
  );
};

export default UpperHeader;
