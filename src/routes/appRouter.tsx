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
        <Route path="/farmer/:id" element={<Farmer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      
      <Footer />
    </Router>
  );
};

export default AppRouter;