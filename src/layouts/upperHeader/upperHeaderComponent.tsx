import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import s from './upperHeader.module.scss';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const UpperHeader: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated);
  const username = useAppSelector((state) => state.authSlice.userName);
  const location = useLocation();

  // Всё равно ли показывать меню?
  const showLinks = !location.pathname.startsWith('/farmer');

  return (
    <div className={s.headerContainer}>
      <div className={s.header}>
        {isAuthenticated ? <h3>{username}</h3> : <Link to="/login">Войти</Link>}

        {showLinks && (
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
        )}

      </div>
    </div>
  );
};

export default UpperHeader;
