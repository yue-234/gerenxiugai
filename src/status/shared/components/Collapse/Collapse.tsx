import { FC, ReactNode, useEffect, useState } from 'react';
import { readSessionState, writeSessionState } from '../../../core/utils';
import styles from './Collapse.module.scss';

export interface CollapseProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  quality?: string;
  storageKey?: string;
}

// 品质样式映射
const qualityStyleMap: Record<string, string> = {
  unique: 'collapseQualityUnique',
  mythic: 'collapseQualityMythic',
  legendary: 'collapseQualityLegendary',
  epic: 'collapseQualityEpic',
  rare: 'collapseQualityRare',
  uncommon: 'collapseQualityUncommon',
};

/**
 * 可折叠面板组件
 */
export const Collapse: FC<CollapseProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  quality,
  storageKey,
}) => {
  const [isOpen, setIsOpen] = useState(() =>
    storageKey ? readSessionState<boolean>(storageKey, defaultOpen) : defaultOpen,
  );

  useEffect(() => {
    if (!storageKey) return;
    writeSessionState(storageKey, isOpen);
  }, [isOpen, storageKey]);

  const qualityClass = quality && qualityStyleMap[quality] ? styles[qualityStyleMap[quality]] : '';
  const openClass = isOpen ? styles.open : '';

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.collapse} ${openClass} ${qualityClass} ${className}`}>
      <div className={styles.collapseHeader} onClick={handleToggle}>
        <div className={styles.collapseTitle}>{title}</div>
        <i className={`${styles.collapseIcon} fa-solid fa-chevron-down`} />
      </div>
      <div className={styles.collapseContent}>
        <div className={styles.collapseInner}>
          <div className={styles.collapseBody}>{children}</div>
        </div>
      </div>
    </div>
  );
};
