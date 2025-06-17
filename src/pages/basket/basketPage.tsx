import { Link } from 'react-router-dom';
import s from './basketPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import { getBasket, updateBasketQuantity } from './basketSlice';
import { checkUser } from '../../features/authForm/authSlice';
import { createOrdersFromBasket } from '../../features/order/orderSlice';

const BasketPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const basket = useAppSelector((state) => state.basketSlice.basketInfo);

  const [orderId, setOrderId] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    delivery_date: '',
  });

  const increaseQuantity = (productId: number, currentQuantity: number) => {
    dispatch(updateBasketQuantity({ productId, quantity: currentQuantity + 1 }));
  };

  const decreaseQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateBasketQuantity({ productId, quantity: currentQuantity - 1 }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(createOrdersFromBasket(formData));

      if (createOrdersFromBasket.fulfilled.match(action)) {
        const orders = action.payload;
        setOrderId(orders.map((o: any) => o.id));
        setShowPopup(true);
        setShowForm(false);
        dispatch(getBasket());
      } else {
        console.error('Ошибка при создании заказов:', action.payload);
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  const closePopup = () => setShowPopup(false);

  useEffect(() => {
    dispatch(checkUser());
    dispatch(getBasket());
  }, []);

  return (
    <div className={s.basket}>
      <h1>Корзина</h1>

      {basket && basket.length > 0 ? (
        basket.map((item) => (
          <div key={item.id} className={s.basketItem}>
            <div className={s.productImage}>
              <img src={item.product.img_url} alt={item.product.name} />
            </div>
            <div className={s.basketDetails}>
              <h3>{item.product.name}</h3>
              <p>Цена: {item.product.price}₽</p>
              <div className={s.quantityControls}>
                <button onClick={() => decreaseQuantity(item.productId, item.quantity)}>–</button>
                <span className={s.quantity}>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.productId, item.quantity)}>+</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <Link className={s.orderButton} to="/">
            Перейти к покупкам
          </Link>
        </div>
      )}

      {basket && basket.length > 0 && (
        <button className={s.orderButton} onClick={() => setShowForm(true)}>
          Оформить заказ
        </button>
      )}

      {/* 📦 Попап для формы */}
      {showForm && (
        <div className={s.popupOverlay} onClick={() => setShowForm(false)}>
          <div className={s.popup} onClick={(e) => e.stopPropagation()}>
            <h2>Введите данные для доставки</h2>
            <form onSubmit={handleOrderSubmit}>
              <label>
                Адрес:
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Дата доставки:
                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Подтвердить</button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Попап подтверждения */}
      {showPopup && (
        <div className={s.popupOverlay} onClick={closePopup}>
          <div className={s.popup} onClick={(e) => e.stopPropagation()}>
            <h2>Спасибо за покупку!</h2>
            <p>
              Ваш заказ
              {Array.isArray(orderId)
                ? <> №{orderId.join(', №')} принят в обработку.</>
                : <> №{orderId} принят в обработку.</>}
            </p>
            <button onClick={closePopup}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
