import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import Farmer from "../pages/farmer/farmer";
import User from "../pages/user/user";
import Header from "../layouts/header/headerComponent";
import Footer from "../layouts/footer/footerComponent";
import NotFound from "../pages/notFound/notFound";
import s from "./appContainer.module.scss"
import UpperHeader from "../layouts/upperHeader/upperHeaderComponent";
import AuthForm from "../features/authForm";
import ProductPage from "../pages/ProductsPage/productPage";
import BasketPage from "../pages/basket/basketPage";
import FarmerPage from "../pages/farmer/farmer";
import FarmerProducts from "../pages/farmer/farmerProducts";
import FarmerOrders from "../pages/farmer/farmerOrders";
import AddProductForm from "../pages/farmer/addProductsForm";
import UserOrdersPage from "../pages/UserOrdersPage";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <UpperHeader/>
      <Header />
      <div className={s.container}>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm/>} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/orders" element={<UserOrdersPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/farmer" element={<FarmerPage />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/farmer/products" element={<FarmerProducts />} />
        <Route path="/farmer/products/add" element={<AddProductForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      
      <Footer />
    </Router>
  );
};

export default AppRouter;