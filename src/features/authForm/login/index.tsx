import { useForm } from 'react-hook-form';
import { loginFormSchema, loginFormData } from '../schemas';
import s from '../form.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';

import { loginDto } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { login } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formErr = useAppSelector((state) => state.authSlice.error);
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated);
  const isFarmer = useAppSelector((state) => state.authSlice.isFarmer);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const onSubmit = async (dto: loginDto) => {
    try {
      const result = await dispatch(login(dto));

      if (login.fulfilled.match(result)) {
        // Успешный логин
        if (dto.isFarmer) {
          navigate('/farmer/orders');
        } else {
          navigate('/');
        }
      } else {
        console.error('Ошибка входа:', result.payload);
      }
    } catch (error) {
      console.error('Ошибка логина:', error);
    }
  };
  

  return (
    <div className={s.formWrapper}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <p>ЭЛ.ПОЧТА</p>
        <input className={s.input} {...register('email')} />
        <b className={s.error}>{errors.email?.message}</b>

        <p>ПАРОЛЬ</p>
        <input type="password" className={s.input} {...register('password')} />
        <b className={s.error}>{errors.password?.message}</b>

        <div className={s.radioGroup}>
          <label className={s.radioLabel}>
            <input type="checkbox" {...register('isFarmer')} />Я фермер
          </label>
        </div>

        <b className={s.error}>{formErr}</b>
        <input className={s.submitBtn} disabled={isSubmitting} type="submit" value="ВОЙТИ" />
      </form>
    </div>
  );
};

export default LoginForm;
