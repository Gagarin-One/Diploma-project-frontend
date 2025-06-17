// src/pages/UserOrdersPage.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from'../../hooks/hooks';
import s from './UserOrdersPage.module.scss';
import { changeOrderStatus, fetchUserOrders } from'../../features/order/orderSlice';
import { createReview } from '../farmer/farmerReviews/farmerReviewsSlice';


const UserOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { userOrders: orders, loading, error } = useAppSelector((state) => state.orderSlice);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [successMsg, setSuccessMsg] = useState('');

  const statusNames = {
    pending: 'В ожидании',
    'in processing': 'В обработке',
    completed: 'Выполнен',
    dismissed: 'Отменен',
  } as Record<string, string>;
  useEffect(() => {
    dispatch(fetchUserOrders()); 
  }, [dispatch]);

  const handleOpen = (orderId: number, sellerId: number) => {
    setSelectedOrderId(orderId);
    setSelectedSellerId(sellerId);
    setIsOpen(true);
    setSuccessMsg('');
    setReviewText('');
    setReviewRating(5);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSellerId(null);
    setSelectedOrderId(null);
    setSuccessMsg('');
    setReviewText('');
    setReviewRating(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSellerId || !selectedOrderId) return;

    try {
      await dispatch(createReview({ 
        orderId: selectedOrderId,
        sellerId: selectedSellerId, 
        review: reviewText, 
        rating: reviewRating 
      })).unwrap();

      setSuccessMsg('Отзыв был успешно добавлен!');
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setSuccessMsg('Не получилось оставить отзыв');
    }
  };

  return (
    <div className={s.page}>
      <h2>Мои заказы</h2>

      {loading && <p>Загрузка заказов...</p>}
      {error && <p className={s.error}>{error}</p>}

      {orders.length === 0 && !loading && <p>У вас пока нет заказов.</p>}

      <div className={s.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={s.orderCard}>
            <h3>Заказ #{order.id}</h3>
            <p>Статус: {statusNames[order.status] ?? order.status}</p>
            <p>Итого: {order.total_price} ₽</p>
            <p>Адрес: {order.address}</p>
            <p className={s.date}>
              Дата доставки: {new Date(order.delivery_date).toLocaleString()}
            </p>

            <div className={s.productList}>
              {order.order_details.map((detail) => (
                <div key={detail.id} className={s.productCard}>
                    <img src={detail.product.img_url} alt={detail.product.name} />
                    <div>
                      <h4>{detail.product.name}</h4>
                      <p>{detail.product.description}</p>
                      <p>Цена: {detail.product.price} ₽</p>
                      <p>Количество: {detail.quantity}</p>
                    </div>
                </div>
              ))}
            </div>

            {/* Кнопка оставить отзыв */}
            <button 
              onClick={() => handleOpen(order.id , order.order_details[0].product.sellerId)}
            >
              Оставить отзыв об этом продавце
            </button>

            {/* В поп-апе с помощью state */}
            {isOpen && selectedSellerId === order.order_details[0].product.sellerId &&
              selectedOrderId === order.id && (
              <div className={s.popup}>
                <button className={s.closeBtn} onClick={handleClose}>
                    ×
                </button>


                

                <form onSubmit={handleSubmit}>
                {successMsg && <p className={s.successMsg}>{successMsg}</p>}
                    <textarea 
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder='Введите свой отзыв'
                      required
                    ></textarea>

<p>Оценка</p>
                    <input 
                      type='number'
                      min='1'
                      max='5'
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      required
                    />

                    <button disabled={!reviewText.trim()} type='submit'>
                        Отправить
                    </button>
                </form>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default UserOrdersPage;
