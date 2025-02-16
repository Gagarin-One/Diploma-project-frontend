import * as yup from 'yup';

export type loginFormData = yup.InferType<typeof loginFormSchema>;
export type registrationFormData = yup.InferType<typeof registrationFormSchema>;

export const loginFormSchema = yup.object().shape({
  email: yup
  .string()
  .email('Неправильно указана почта').required('Поле обязательно'),
  password: yup
    .string()
    .min(6, 'Длина пароля должна быть более 6 символов')
    .required('Поле обязательно'),
});

export const registrationFormSchema = yup.object().shape({
  username: yup.string().required('Поле обязательно'),
  email: yup.string().email('Неправильно указана почта').required('Поле обязательно'),
  password1: yup
    .string()
    .min(6, 'Длина пароля должна быть более 6 символов')
    .required('Поле обязательно')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву.')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву.'),
  password2: yup
    .string()
    .oneOf([yup.ref('password1'), undefined], 'Пароли не совпадают')
    .min(6, 'Длина пароля должна быть более 6 символов')
    .required('Поле обязательно')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву.')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву.'),
});
