// pages/UserOrdersPage.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

import s from './UserOrdersPage.module.scss'; // создай при желании
import { changeOrderStatus, fetchUserOrders } from '../../features/order/orderSlice';
import { fetchFarmerOrders } from '../farmer/farmerSlise';

const UserOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { userOrders:orders, loading, error } = useAppSelector((state) => state.orderSlice);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

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
            <p>Статус: {order.status}</p>
            <p>Итого: {order.total_price} ₽</p>
            <p>Адрес: {order.address} ₽</p>
            <p className={s.date}>Дата доставки: {new Date(order.delivery_date).toLocaleString()}</p>

            <div className={s.productList}>
            {
                    order.status !== 'completed' &&
                    order.status !== 'dismissed' && (
                      <button
                        className={s.dismissBtn}
                        onClick={() =>{
                          dispatch(changeOrderStatus({ orderId: order.id, status: 'dismissed' }))
                          }
                        }>
                        Отменить заказ
                      </button>
                    )}
              {order.order_details.map((detail:any) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;
