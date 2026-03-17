'use client';
import { useState, FC } from 'react';
import styles from './styles.module.css';

type paginationComponentProps = {
  totalPages: number;
  page: number;
  leftWrapperPageProp: number;
  changePage: (page: number) => void;
  changeLeft: (leftWrapperPage: number) => void;
}

const PaginationComponent: FC<paginationComponentProps> = ({ totalPages, page, changePage, leftWrapperPageProp, changeLeft }) => {

  const [activePage, setActivePage] = useState<number>(page)
  const arrPages = Array.from({ length: totalPages }, (_, i) => i + 1);


  const [leftWrapperPage, setLeftWrapperPage] = useState(leftWrapperPageProp);

  const biasWrapperpageLeft = () => {
    if (leftWrapperPage === 0) return
    setLeftWrapperPage(leftWrapperPage + 200);

  }

  const biasWrapperpageRight = () => {
    if (totalPages === 4) return;
    const lastPage = Math.floor(totalPages / 4) * 200 - 200

    if (lastPage - Math.abs(leftWrapperPage) < 200) return;
    setLeftWrapperPage(leftWrapperPage - 200);

  }

  const choisePage = (el: number) => {
    setActivePage(el)
    changePage(el)
    changeLeft(leftWrapperPage)
  }

  return (
    <div className={styles.pagination}>
      <div className={styles.leftArrow} onClick={biasWrapperpageLeft}>&#706;</div>
      <div className={styles.containerPage}>
        <div className={styles.wrapperPage} style={{ left: leftWrapperPage }}>
          {arrPages.map(el => <div className={`${styles.page} ${activePage === el ? styles.activePage : ''}`} key={el} onClick={() => choisePage(el)}>{el}</div>)}
        </div>
      </div>
      <div className={styles.rightArrow} onClick={biasWrapperpageRight}>&#707;</div>
    </div>
  );
}

export default PaginationComponent;