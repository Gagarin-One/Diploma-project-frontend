import React from 'react';
import styles from './SuccessPopup.module.scss';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;