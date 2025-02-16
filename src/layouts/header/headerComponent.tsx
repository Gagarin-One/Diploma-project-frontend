
import s from './header.module.scss'

const Header: React.FC = () => {
 

  return <div className={s.headerContainer}>
    <div className={s.header}>
      <h1>fable</h1>
    <h3>СВЕЖАЯ ПРОДУКЦИЯ НАПРЯМУЮ ОТ ФЕРМЕРОВ</h3>
    </div>


  </div>;
};

export default Header