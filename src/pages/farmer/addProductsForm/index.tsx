import React, { useEffect, useRef, useState } from 'react';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { addProduct, resetStatus } from '../farmerSlise';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import styles from './addProductsForm.module.scss';
import FarmerNavHeader from '../../../components/FarmerNavHeader';
import { checkFarmer } from '../../../features/authForm/authSlice';
import { RootState } from '../../../redux/store';
import SuccessPopup from '../../../components/SuccessPopup';
import { useNavigate } from 'react-router-dom';
const AddProductForm = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
const navigate = useNavigate();
  const token = Cookies.get('farmerToken');
    if (!token) throw new Error('Пользователь не авторизован');
      const decoded = jwtDecode<{ id: number }>(token);
      const sellerId = decoded.id;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    img: null as File | null,
  });

  const [popupShown, setPopupShown] = useState(false);
  const status = useAppSelector((state: RootState) => state.farmerSlise.status);

  useEffect(() => {
    const token = Cookies.get('farmerToken');
    if (token) {
      dispatch(checkFarmer());
    } else {
      console.warn('Нет токена фермера');
    }
  }, []);

  useEffect(() => {
    if (status === 'succeeded' && !popupShown) {
      setPopupShown(true); // показать попап
    }
  }, [status, popupShown]);

  useEffect(() => {
    if (status === 'succeeded') {
      // Очистка формы
      if (formRef.current) {
        formRef.current.reset();
      }
  
      // Редирект с задержкой (например, через 1.5 сек)
      setTimeout(() => {
        dispatch(resetStatus());
        navigate('/farmer/products');
      }, 2000);
    }
  }, [status, dispatch, navigate]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, img: e.target.files![0] }));
    }
  };

  const handleClosePopup = () => {
    setPopupShown(false);
    dispatch(resetStatus());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.img || !sellerId) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('categoryId', form.categoryId);
    formData.append('sellerId', sellerId.toString());
    formData.append('img', form.img);

    dispatch(addProduct(formData));
  };

  return (<>
  {popupShown && (
  <SuccessPopup
    message="Товар успешно добавлен!"
    onClose={handleClosePopup}
  />
)}
    <FarmerNavHeader />
    <div className={styles.container}>
      
  <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
    <h2 className={styles.title}>Добавить новый товар</h2>

    <input
      name="name"
      placeholder="Название"
      onChange={handleChange}
      value={form.name}
      className={styles.input}
      required
    />

    <textarea
      name="description"
      placeholder="Описание"
      onChange={handleChange}
      value={form.description}
      className={styles.textarea}
      required
    />

    <input
      name="price"
      type="number"
      placeholder="Цена"
      onChange={handleChange}
      value={form.price}
      className={styles.input}
      required
    />

    <input
      name="categoryId"
      type="number"
      placeholder="ID категории"
      onChange={handleChange}
      value={form.categoryId}
      className={styles.input}
      required
    />

    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className={styles.fileInput}
      required
    />

    <button type="submit" className={styles.button}>
      Добавить товар
    </button>
  </form>
</div>
</>
  );
};

export default AddProductForm;
