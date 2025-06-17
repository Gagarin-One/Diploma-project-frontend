import React, { useEffect } from 'react';
import s from './../farmer.module.scss';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchReviews } from './farmerReviewsSlice';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import FarmerNavHeader from '../../../components/FarmerNavHeader';

export function FarmerReviews() {
  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.farmerReviewsSlice);

  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (!token) throw new Error('Не авторизован');

    const decoded = jwtDecode<{ id: number }>(token);
    const farmerId = decoded.id;
    dispatch(fetchReviews(farmerId));
  }, [dispatch]);

  if (loading) return <div className={s.ordersContainer}>
      <FarmerNavHeader /><p>Загрузка...</p></div>;
  if (error) return <div className={s.ordersContainer}>
<FarmerNavHeader /><p>Ошибка: {error}</p></div>
  if (reviews.length === 0) return <div className={s.ordersContainer}>
<FarmerNavHeader /><p>Отзывов пока нет</p></div>;





  return (
    <div className={s.ordersContainer}>
      <FarmerNavHeader />
      <div className="p-4 rounded-md shadow-md bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Отзывы о вас</h2>
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="p-3 rounded-md border border-gray-300 bg-gray-100">
              <p>Пользователь: {review.user.username}</p>
              <p>Рейтинг: {review.rating}/5</p>
              <p>Отзыв: {review.review_text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FarmerReviews;
