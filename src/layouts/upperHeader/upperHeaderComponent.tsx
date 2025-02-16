import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks';
import s from './upperHeader.module.scss'

const UpperHeader: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated)

  return <div className={s.headerContainer}>
    <div className={s.header}>
      <h3>условия доставки</h3>
      {isAuthenticated ? <h3>имя пользователя</h3> : <Link to="/login">Вход</Link>}
      
    </div>


  </div>;
};

export default UpperHeader