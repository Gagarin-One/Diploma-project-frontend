import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import Farmer from "../pages/farmer/farmer";
import Registration from "../pages/registration/registration";
import User from "../pages/user/user";
import Login from "../pages/login/login";
import Header from "../layouts/header/headerComponent";
import Footer from "../layouts/footer/footerComponent";
import NotFound from "../pages/notFound/notFound";
import s from "./appContainer.module.scss"
import UpperHeader from "../layouts/upperHeader/upperHeaderComponent";
const AppRouter: React.FC = () => {
  return (
    <Router>
      <UpperHeader/>
      <Header />
      <div className={s.container}>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/farmer/:id" element={<Farmer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      
      <Footer />
    </Router>
  );
};

export default AppRouter;