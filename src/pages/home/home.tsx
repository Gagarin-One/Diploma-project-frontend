import styles from './styles.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import ProductCard from '../../components/productCard/productCard';
import { useEffect, useState } from 'react';
import { fetchAllProducts, Product, setCurrentPage } from '../home/homeSlice';
import { checkUser } from '../../features/authForm/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination/pagination';
import { getBasket } from '../basket/basketSlice';

const User: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.userSlice.products);
  const totalProductsAmount = useAppSelector((state) => state.userSlice.totalProductsAmount);
  const currentPage = useAppSelector((state) => state.userSlice.currentPage);
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchAllProducts({}));
    dispatch(getBasket());
    dispatch(checkUser());
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    setQuery(newValue);
    dispatch(fetchAllProducts({ searchString: newValue }));
  };

  const handlePageChange = (currNewPage: number) => {
    dispatch(setCurrentPage(currNewPage));
    dispatch(fetchAllProducts({ page: currNewPage }));
  };

  return (
    <div>
      <div className={styles.ad}>СВЕЖИЕ ФРУКТЫ, ОВОЩИ,</div>
      <div className={styles.ad}>ЛУЧШИЙ НА СВЕТЕ ХЛЕБ</div>
      <div className={styles.ad}>И МНОГОЕ ДРУГОЕ.</div>
      <div className={styles.lowerAd}>
        - ПОТОМУ НАШИ ФЕРМЕРЫ ДЕЛАЮТ НЕ МАССОВОЕ, А ШТУЧНОЕ. СПЕЦИАЛЬНО ДЛЯ ВАС.
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.linksContainer}>
          <Link to="/vegetables">Овощи</Link>
          <Link to="/fruits">Фрукты</Link>
          <Link to="/milkProducts">Молочная продукция</Link>
          <Link to="/meat">Мясо</Link>
          <Link to="/bakeryProducts">Выпечка и хлеб</Link>
        </div>
        <input
          type="text"
          value={query}
          placeholder="Поиск"
          onChange={handleChange}
          className={styles.findInput}
        />
        <div className={styles.iconContainer}>
          <img
            src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%3e%3cg%20fill='none'%20fill-rule='evenodd'%3e%3cpath%20d='M0%2024h24V0H0z'/%3e%3cpath%20stroke='%23FFF'%20d='M20.5%2020.5l-5-5M10.5%203a7.5%207.5%200%201%201%200%2015%207.5%207.5%200%200%201%200-15z'/%3e%3c/g%3e%3c/svg%3e"
            alt="Search Icon"
            className={styles.searchIcon}
          />
        </div>
      </div>

      <div className={styles.container}>
        {products?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        totalItems={totalProductsAmount}
        itemsPerPage={16}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default User;
