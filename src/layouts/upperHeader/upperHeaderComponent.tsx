import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import s from './upperHeader.module.scss'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const UpperHeader: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated)
  const token = Cookies.get('authToken');
  const decoded = jwtDecode<{ id: number }>(token);
  const username = decoded.username;
  return <div className={s.headerContainer}>
    <div className={s.header}>
      <h3>Условия доставки</h3>
      {isAuthenticated ? <h3>{username}</h3> : <Link to="/login">войти</Link>}
      <div className={s.emptyWrapper}>
     <h3><Link to="/basket" className={s.emptyButton}>
        Корзина
      </Link></h3>
      
    </div>
    </div>


  </div>;
};

export default UpperHeader