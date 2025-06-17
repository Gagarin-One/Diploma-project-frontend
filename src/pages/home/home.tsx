import styles from './styles.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import ProductCard from '../../components/productCard/productCard';
import { useEffect, useState } from 'react';
import { fetchAllProducts, Product, setCurrentPage } from '../home/homeSlice';
import { checkUser } from '../../features/authForm/authSlice';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination/pagination';
import { getBasket } from '../basket/basketSlice';

const User: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.userSlice.products);
  const totalProductsAmount = useAppSelector((state) => state.userSlice.totalProductsAmount);
  const currentPage = useAppSelector((state) => state.userSlice.currentPage);
  const navigate = useNavigate();

  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [priceSort, setPriceSort] = useState<string>(''); // 'asc' | 'desc' | ''

  useEffect(() => {
    dispatch(fetchAllProducts({ page: currentPage, categoryId: selectedCategory, searchString: query, priceSort }));
    dispatch(getBasket());
    dispatch(checkUser());
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    dispatch(fetchAllProducts({
      page: currentPage,
      categoryId: selectedCategory,
      searchString: newValue,
      priceSort
    }));
  };

  const handlePageChange = (currNewPage: number) => {
    dispatch(setCurrentPage(currNewPage));
    dispatch(fetchAllProducts({
      page: currNewPage,
      categoryId: selectedCategory,
      searchString: query,
      priceSort
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const category = value || undefined;
    setSelectedCategory(category);
    dispatch(fetchAllProducts({
      page: currentPage,
      categoryId: category,
      searchString: query,
      priceSort
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setPriceSort(sortValue);
    dispatch(fetchAllProducts({
      page: currentPage,
      categoryId: selectedCategory,
      searchString: query,
      priceSort: sortValue
    }));
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
        <select
          value={selectedCategory ?? ''}
          onChange={handleCategoryChange}
          className={styles.sortSelect}
        >
          <option value="">Все категории</option>
          <option value={1}>Овощи</option>
          <option value={2}>Фрукты</option>
          <option value={3}>Молочная продукция</option>
          <option value={4}>Мясо</option>
          <option value={5}>Выпечка и хлеб</option>
        </select>
        <select value={priceSort} onChange={handleSortChange} className={styles.sortSelect}>
          <option value="">Сортировать по цене</option>
          <option value="asc">Сначала дешёвые</option>
          <option value="desc">Сначала дорогие</option>
        </select>
        <input
          type="text"
          value={query}
          placeholder="Поиск"
          onChange={handleSearchChange}
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
