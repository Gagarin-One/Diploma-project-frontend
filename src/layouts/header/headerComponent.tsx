
import { Link } from 'react-router-dom';
import s from './header.module.scss'

const Header: React.FC = () => {
 

  return <div className={s.headerContainer}>
    <div className={s.header}>
      <Link to="/">fable</Link>
    <h3>СВЕЖАЯ ПРОДУКЦИЯ НАПРЯМУЮ ОТ ФЕРМЕРОВ</h3>
    </div>


  </div>;
};

export default Header