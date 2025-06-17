// EditProductForm.jsx
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import styles from '../addProductsForm/addProductsForm.module.scss';
import FarmerNavHeader from '../../../components/FarmerNavHeader';
import { checkFarmer } from '../../../features/authForm/authSlice';
import { RootState } from '../../../redux/store';
import SuccessPopup from '../../../components/SuccessPopup';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct, resetEditStatus } from '../farmerSlise';

const CATEGORIES = [
  { id: 1, name: 'Овощи' },
  { id: 2, name: 'Фрукты' },
  { id: 3, name: 'Молочная продукция' },
  { id: 4, name: 'Мясная продукция' },
  { id: 5, name: 'Выпечка и хлеб' },
  // добавь варианты по своему
]


const EditProductForm = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const { id } = useParams();

  if (!id) {
    console.error('Нет id товара');
    return <div>Нет такого товара</div>;
  }

  const token = Cookies.get('farmerToken');
  if (!token) throw new Error('Пользователь не авторизован');
  const decoded = jwtDecode<{ id: number }>(token);
  const sellerId = decoded.id;

  const [form, setForm] = useState({ 
    name: '',
    description: '',
    price: '',
    categoryId: '',
    measure: '',
    img: null as File | null,
  });

  const [popupShown, setPopupShown] = useState(false);
  const editStatus = useAppSelector((state: RootState) => state.farmerSlise.editStatus);

  useEffect(() => {
    if (token) {
      dispatch(checkFarmer()); 
    }
  }, [token]);

  useEffect(() => {
    if (editStatus === 'succeeded') {
      setPopupShown(true);
      setTimeout(() => {
        setPopupShown(false);
        dispatch(resetEditStatus()); 
        navigate('/farmer/products'); 
      }, 2000);
    }
  }, [editStatus, dispatch, navigate]);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e:any) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({
        ...prev,
        img: e.target.files[0]
      }));
    }
  };

  const handleClosePopup = () => {
    setPopupShown(false);
    dispatch(resetEditStatus()); 
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    if (!sellerId) return;

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('categoryId', form.categoryId);
    formData.append('sellerId', sellerId.toString()); 
    formData.append('measure', form.measure);

    if (form.img) {
      formData.append('img', form.img);
    }

    dispatch(updateProduct({ id: Number(id), formData }));

  };

  return (
    <>
      {popupShown && (
        <SuccessPopup
          message="Товар успешно изменен!"
          onClose={handleClosePopup}
        />
      )}

      <FarmerNavHeader />

      <div className={styles.container}>
        <form onSubmit={handleSubmit} ref={formRef} className={styles.form}>
          <h2 className={styles.title}>
            Редактировать товар
          </h2>

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

          <select
            name="categoryId"
            onChange={handleChange}
            value={form.categoryId}
            className={styles.select}
            required
          >
            <option value="">Выберите категорию</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            name="measure"
            type="text"
            placeholder="Укажите меру измерения количества"
            onChange={handleChange}
            value={form.measure}
            className={styles.input}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          <button type="submit" className={styles.button}>
            Обновить товар
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProductForm;

