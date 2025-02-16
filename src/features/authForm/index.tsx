import { useState } from 'react';
import LoginForm from './login';
import RegistrationForm from './registration';
import s from './form.module.scss';
const AuthForm = () => {
  const [formSection, setFormSection] = useState('login');

  return (
    <div className={s.wrapper}>
      <div className={s.window}>
        <div>
          {formSection === 'login' && <LoginForm />}
          {formSection === 'registration' && <RegistrationForm />}
        </div>
        <div>
          {formSection === 'login' && (
            <button onClick={() => setFormSection('registration')}>БЫСТРАЯ РЕГИСТРАЦИЯ</button>
          )}
          {formSection === 'registration' && (
            <button onClick={() => setFormSection('login')}>ВОЙТИ</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthForm;
