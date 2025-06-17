// FarmerProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import ProductCard from '../../../components/productCard/productCard';
import Pagination from '../../../components/Pagination/pagination';

import styles from './farmerProducts.module.scss';
import { fetchFarmerProducts, setFarmerPage, setSearchQuery } from './farmerProductsSlice';
import { checkFarmer } from '../../../features/authForm/authSlice';
import Cookies from 'js-cookie';
import FarmerNavHeader from '../../../components/FarmerNavHeader';


const FarmerProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.farmerProductsSlice.products);
  const totalProducts = useAppSelector((state) => state.farmerProductsSlice.totalProducts);
  const currentPage = useAppSelector((state) => state.farmerProductsSlice.currentPage);
  const loading = useAppSelector((state) => state.farmerProductsSlice.loading);

  const [searchQuery, setSearchQueryState] = useState<string>('');

  
  
  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (token) {
      dispatch(checkFarmer());
      dispatch(fetchFarmerProducts({}));
    } else {
      console.warn('Нет токена фермера');
    }
  }, []);


  const handlePageChange = (currNewPage: number) => {
    dispatch(setFarmerPage(currNewPage));
    dispatch(fetchFarmerProducts({ page: currNewPage }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    setSearchQueryState(newValue);

    dispatch(fetchFarmerProducts({  searchString: newValue  }));
  };


  return (
    <div>

      <FarmerNavHeader />
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск по товарам"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.findInput}
        />
      </div>

      <div className={styles.container}>
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      <Pagination
        totalItems={totalProducts}
        itemsPerPage={9}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FarmerProductsPage;
