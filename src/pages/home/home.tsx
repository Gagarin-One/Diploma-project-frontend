
import styles from './styles.module.scss';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import ProductCard from '../../components/product';
import { useEffect } from 'react';
import { fetchAllProducts } from '../home/homeSlice';
type Product = {
  id: number,
  name: string,
  description: string,
  price: number,
  img_url: string
  }
  
const User: React.FC = () => {

const dispatch = useAppDispatch()
const products = useAppSelector((state) => state.userSlice.products)


useEffect(() => {
  // Запрашиваем продукты при монтировании компонента
  dispatch(fetchAllProducts());
}, [dispatch]);


  return (
    <div>
      <div className={styles.container}>{products?.map((product:Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
</div>
    </div>
  );
};

export default User;
