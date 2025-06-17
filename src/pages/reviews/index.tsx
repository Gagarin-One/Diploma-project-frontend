import React, { useEffect } from 'react';
import s from './../farmer/farmer.module.scss';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchReviews } from '../farmer/farmerReviews/farmerReviewsSlice';
import FarmerNavHeader from '../../components/FarmerNavHeader';
import { useParams } from 'react-router-dom';

export function ReviewsPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { reviews, loading, error } = useAppSelector((state) => state.farmerReviewsSlice);

  useEffect(() => {
    if (id) {
      dispatch(fetchReviews(Number(id)));
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <div className={s.ordersContainer}>
        <p>Загрузка...</p>
      </div>
    );
  if (error)
    return (
      <div className={s.ordersContainer}>
        <p>Ошибка: {error}</p>
      </div>
    );
  if (reviews.length === 0)
    return (
      <div className={s.ordersContainer}>
        <p>Отзывов пока нет</p>
      </div>
    );

  return (
    <div className={s.ordersContainer}>
      <div className="p-4 rounded-md shadow-md bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Отзывы о продавце</h2>
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="p-3 rounded-md border border-gray-300 bg-gray-100">
              <p>Покупатель: {review.user.username}</p>
              <p>Рейтинг: {review.rating}/5</p>
              <p>Отзыв: {review.review_text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReviewsPage;
