import { Link,  useParams } from 'react-router-dom';
import s from './basketPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import { getBasket, updateBasketQuantity } from './basketSlice';
import { checkUser } from '../../features/authForm/authSlice';
import { createOrdersFromBasket } from '../../features/order/orderSlice';

const BasketPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const basket = useAppSelector((state) => state.basketSlice.basketInfo);

  const [orderId, setOrderId] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const increaseQuantity = (productId: number, currentQuantity: number) => {
    dispatch(updateBasketQuantity({ productId, quantity: currentQuantity + 1 }));
  };

  const decreaseQuantity = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(updateBasketQuantity({ productId, quantity: currentQuantity - 1 }));
    }
  };
  const handleOrder = async () => {
    try {
      const action = await dispatch(createOrdersFromBasket());
  
      if (createOrdersFromBasket.fulfilled.match(action)) {
        const orders = action.payload; // массив заказов [{ id: 1 }, { id: 2 }]
        const orderIds = orders.map((order: { id: number }) => order.id);
  
        setOrderId(orderIds); // сохраняем массив ID
        setShowPopup(true);
        dispatch(getBasket())
      } else {
        console.error('Ошибка при создании заказов:', action.payload);
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  useEffect(() => {
    dispatch(checkUser());
    dispatch(getBasket());
  }, []);
  return (
    <div className={s.basket}>
      <h1>Корзина</h1>
      {basket && basket.length > 0 ? (basket.map((item) => (
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
      
      ):(<div>

<Link className={s.orderButton} to="/">
        Перейти к покупкам
      </Link>
      </div>)}
{basket && basket.length > 0 && <button className={s.orderButton} onClick={handleOrder}>
        Оформить заказ
      </button>}
      

      {showPopup && (
        <div className={s.popupOverlay} onClick={closePopup}>
          <div className={s.popup} onClick={(e) => e.stopPropagation()}>
            <h2>Спасибо за покупку!</h2>
            <p>
              Ваш заказ
              {Array.isArray(orderId) ? (
                <>№{orderId.join(', №')} принят в обработку.</>
              ) : (
                <> №{orderId} принят в обработку.</>
              )}
            </p>
            <button onClick={closePopup}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasketPage;
