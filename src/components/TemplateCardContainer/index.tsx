import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface TemplateCardContainerProps {
  children: ReactNode;
}

const TemplateCardContainer: React.FC<TemplateCardContainerProps> = ({ children }) => {
  return <div className={styles.cardContainer}>{children}</div>;
};

export default TemplateCardContainer;
