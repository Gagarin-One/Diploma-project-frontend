import React from 'react';
import s from './pagination.module.scss';
interface PaginationProps {
    totalItems: number; // Общее количество продуктов
    itemsPerPage: number; // Количество продуктов на странице
    currentPage: number; // Текущая страница
    onPageChange: (page: number) => void; // Функция для изменения страницы
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
            console.log(currentPage - 1)
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            console.log(currentPage + 1)
        }
    };

    const handlePageClick = (page: number) => {
        onPageChange(page);
        console.log(currentPage)
    };

    return (
        <div className={s.pagination}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
            ))}

            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;