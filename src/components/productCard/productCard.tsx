import { useNavigate } from 'react-router-dom';
import { Product } from '../../pages/home/homeSlice';
import s from './productCard.module.scss';



const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={s.container} onClick={handleCardClick}>
      <div className={s.card}>
        <div className={s.imageContainer}>
        <img src={product.img_url} alt={product.name} />
        </div>
        
        <b className={s.price}>{product.price} руб</b>
        <h4>{product.sellerName}</h4>
        <h3>{product.name}</h3>
      </div>
    </div>
  );
};
export default ProductCard;
