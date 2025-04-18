import { Link, useParams } from 'react-router-dom';
import s from './productPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useEffect, useState } from 'react';
import { getProductById, addToBasket } from './productPageSlice';
import { checkUser } from '../../features/authForm/authSlice';
import { getBasket } from '../basket/basketSlice';

const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const productInfo = useAppSelector((state) => state.productSlice.productInfo);
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated);
  const isAddToBasket = useAppSelector((state) => state.productSlice.isAddToBasket);
  const basketInfo = useAppSelector((state) => state.basketSlice.basketInfo )
  const params = useParams();
  const [attentionPopup, setAttentionPopup] = useState(false);

  const { id } = useParams();
  const numericId = Number(id)

  const hasProduct = basketInfo.some(item => item.productId === numericId);

  useEffect(() => {
    dispatch(getProductById(Number(params.id)));
    dispatch(checkUser());
    dispatch(getBasket());
  }, []);

  const addToBasketClick = () => {
    if (!isAuthenticated) {
      setAttentionPopup(true);
    } else if (productInfo.id) {
      dispatch(addToBasket({ productId: productInfo.id, quantity: 1 }));
    }
  };
  return (
    <div className={s.productPage}>
      <div className={s.imageContainer}>
        {attentionPopup && <div>fgfgfg</div>}
        <img src={productInfo.img} alt="" />
      </div>
      <div className={s.sideBar}>
        <h3>{productInfo.category}</h3>
        <h2>{productInfo.productName}</h2>
        <h4>Продавец: {productInfo.sellerName}</h4>
        <b>{productInfo.price} ₽</b>
        <h3 className={s.description}>{productInfo.description}</h3>
        {!hasProduct ? (
          <button onClick={() => addToBasketClick()}>Добавить в корзину</button>
        ) : (
  
            <button onClick={() => addToBasketClick()}>Добавлено в корзину!</button>
  
        )}

        <Link to="/login">Узнать условия доставки</Link>
      </div>
    </div>
  );
};

export default ProductPage;
