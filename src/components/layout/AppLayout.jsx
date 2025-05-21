import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import styles from './AppLayout.module.scss';

function AppLayout({ children }) {
  return (
    <div className={styles.container}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}

export default AppLayout;
