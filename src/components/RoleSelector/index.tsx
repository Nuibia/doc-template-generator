import { Checkbox, Typography } from 'antd';
import React from 'react';
import styles from './styles.module.css';

const { Title } = Typography;

export type RoleType = 'pm' | 'frontend' | 'backend';

interface RoleSelectorProps {
  selectedRoles: RoleType[];
  onChange: (roles: RoleType[]) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRoles, onChange }) => {
  const options = [
    { label: 'PM', value: 'pm' },
    { label: '前端开发', value: 'frontend' },
    { label: '后端开发', value: 'backend' },
  ];

  const handleChange = (checkedValues: any[]) => {
    onChange(checkedValues as RoleType[]);
  };

  return (
    <div className={styles.roleSelector}>
      <Title level={4}>选择角色</Title>
      <p className={styles.description}>请选择您的角色，将根据角色显示相关表单内容</p>
      <Checkbox.Group options={options} value={selectedRoles} onChange={handleChange} />
    </div>
  );
};

export default RoleSelector;
