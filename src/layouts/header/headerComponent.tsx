import s from './header.module.scss'

const Header: React.FC = () => {

  return <div className={s.headerContainer}>
    <div className={s.header}><h1>fable</h1></div>


  </div>;
};

export default Header