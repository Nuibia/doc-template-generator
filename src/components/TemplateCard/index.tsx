import { Button } from 'antd';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface TemplateCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  templateId: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ icon, title, description, templateId }) => {
  return (
    <div className={styles.templateCard}>
      <div className={styles.cardCover}>{icon}</div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <div className={styles.cardAction}>
        <Link href={`/template/${templateId}`} passHref>
          <Button type="primary">使用此模板</Button>
        </Link>
      </div>
    </div>
  );
};

export default TemplateCard;
