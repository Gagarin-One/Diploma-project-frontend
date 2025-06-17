// pages/FarmerOrdersPage.tsx
import { useEffect } from 'react';
import s from './farmer.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchFarmerOrders } from './farmerSlise';
import { checkFarmer, checkUser } from '../../features/authForm/authSlice';
import FarmerNavHeader from '../../components/FarmerNavHeader';
import Cookies from 'js-cookie';

const FarmerPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.farmerSlise);

  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (token) {
      dispatch(checkFarmer());

    } else {
      console.warn('Нет токена фермера');
    }
  }, []);

  return (
    <div className={s.ordersContainer}>
    <FarmerNavHeader />
    

    {/* Здесь будет список товаров или форма */}
    <p>Здесь будут отображаться товары фермера.</p>
  </div>
  );
};

export default FarmerPage;
