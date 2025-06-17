// pages/FarmerOrdersPage.tsx
import { useEffect } from 'react';
import s from './../farmer.module.scss';

import { fetchFarmerOrders } from './../farmerSlise';
import { checkFarmer, checkUser } from '../../../features/authForm/authSlice';
import FarmerNavHeader from '../../../components/FarmerNavHeader';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import Cookies from 'js-cookie';
import { changeOrderStatus } from '../../../features/order/orderSlice';
import { useNavigate } from 'react-router-dom';

const FarmerOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.farmerSlise);
const navigate = useNavigate()
  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (token) {
      dispatch(checkFarmer());
      dispatch(fetchFarmerOrders());
    } else {
      console.warn('Нет токена фермера');
      navigate('/login');
    }
  }, []);
  const statusNames = {
    pending: 'В ожидании',
    'in processing': 'В обработке',
    completed: 'Выполнен',
    dismissed: 'Отменен',
  } as Record<string, string>;

  return (
    <div className={s.ordersContainer}>
      <FarmerNavHeader />

      <h2>Мои заказы</h2>

      {loading && <p>Загрузка...</p>}
      {error && <p className={s.error}>{error}</p>}

      <div className={s.ordersList}>
        {Array.isArray(orders) &&
          orders.map((order) => (
            <div key={order.id} className={s.orderCard}>
              <h3>Заказ #{order.id}</h3>
              <p>Статус: {statusNames[order.status] ?? order.status}</p>
              <p>Сумма: {order.total_price} ₽</p>
              <p>Адрес: {order.address} ₽</p>
            <p className={s.date}>Дата доставки: {new Date(order.delivery_date).toLocaleString()}</p>

              <div className={s.productsList}>
                <div className={s.orderActionsWrapper}>
                {order.status !== 'pending' &&
                      order.status !== 'completed' &&
                      order.status !== 'dismissed' && <p>Изменить статус:</p>}
                  
                  <div className={s.orderActions}>
                  
                    {order.status === 'pending' && (
                      <button
                        onClick={() =>
                          dispatch(
                            changeOrderStatus({ orderId: order.id, status: 'in processing' }),
                          )
                        }>
                        Принять в обработку
                      </button>
                    )}

                    {order.status === 'in processing' && (
                      <button
                        onClick={() =>
                          dispatch(changeOrderStatus({ orderId: order.id, status: 'completed' }))
                        }>
                        Заказ доставлен
                      </button>
                    )}

                    {order.status !== 'pending' &&
                      order.status !== 'completed' &&
                      order.status !== 'dismissed' && (
                        <button
                          className={s.dismissBtn}
                          onClick={() =>
                            dispatch(changeOrderStatus({ orderId: order.id, status: 'dismissed' }))
                          }>
                          Отменить заказ
                        </button>
                      )}
                  </div>
                </div>

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
            </div>
          ))}
      </div>
    </div>
  );
};

export default FarmerOrders;
