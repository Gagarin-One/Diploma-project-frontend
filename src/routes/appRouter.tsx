import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/home/home';
import User from '../pages/user/user';
import Header from '../layouts/header/headerComponent';
import Footer from '../layouts/footer/footerComponent';
import NotFound from '../pages/notFound/notFound';
import s from './appContainer.module.scss';
import UpperHeader from '../layouts/upperHeader/upperHeaderComponent';
import AuthForm from '../features/authForm';
import ProductPage from '../pages/ProductsPage/productPage';
import BasketPage from '../pages/basket/basketPage';
import FarmerPage from '../pages/farmer/farmer';
import FarmerProducts from '../pages/farmer/farmerProducts';
import FarmerOrders from '../pages/farmer/farmerOrders';
import AddProductForm from '../pages/farmer/addProductsForm';
import UserOrdersPage from '../pages/UserOrdersPage';
import FarmerReviews from '../pages/farmer/farmerReviews';
import EditProductForm from '../pages/farmer/EditProductForm';
import ReviewsPage from '../pages/reviews';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <UpperHeader />
      <Header />
      <div className={s.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/review/:id" element={<ReviewsPage />} />
          <Route path="/farmer" element={<FarmerPage />} />
          <Route path="/farmer/orders" element={<FarmerOrders />} />
          <Route path="/farmer/reviews" element={<FarmerReviews />} />
          <Route path="/farmer/products" element={<FarmerProducts />} />
          <Route path="/farmer/products/add" element={<AddProductForm />} />
          <Route path="/farmer/products/edit/:id" element={<EditProductForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default AppRouter;
