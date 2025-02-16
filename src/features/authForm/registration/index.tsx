import { useForm } from 'react-hook-form';
import { registrationFormSchema, registrationFormData } from '../schemas';
import s from '../form.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { registerUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RegistrationForm = () => {
  const dispatch = useAppDispatch();

  const formErr = useAppSelector((state) => state.authSlice.error);
  const isAuthenticated = useAppSelector((state) => state.authSlice.isAuthenticated);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registrationFormData>({
    resolver: yupResolver(registrationFormSchema),
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  const onSubmit = async (dto: registrationFormData) => {
  dispatch(registerUser({username : dto.username, email: dto.email, password: dto.password1}))
     
  };

  return (
    <div className={s.formWrapper}>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <p>ИМЯ И ФАМИЛИЯ</p>
        <input className={s.input} {...register('username')} />
        <b className={s.error}>{errors.username?.message}</b>
        <p>ЭЛ.ПОЧТА</p>
        <input className={s.input} {...register('email')} />
        <b className={s.error}>{errors.email?.message}</b>
        <p>ПАРОЛЬ</p>
        <input className={s.input} {...register('password1')} />
        <b className={s.error}>{errors.password1?.message}</b>
        <p>ПОВТОРИТЕ ПАРОЛЬ</p>
        <input className={s.input} {...register('password2')} />
        <b className={s.error}>{errors.password2?.message}</b>
        <b className={s.error}>{formErr}</b>
        <input
          className={s.submitBtn}
          type="submit"
          disabled={isSubmitting}
          value="ЗАРЕГИСТРИРОВАТЬСЯ"
        />
      </form>
    </div>
  );
};

export default RegistrationForm;
