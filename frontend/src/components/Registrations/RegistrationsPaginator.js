import React from 'react';
import './RegistrationsPaginator.css';

const registrationPaginator = props => {
    if (props.loading) {
        return;
    }
    
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(props.total / props.perPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) {
        return;
    }

    return (
        <div className='paginator-wrapper'>
            { props.currentPage > 1 && <span onClick={() => {props.setPage(props.currentPage - 1)}}> {'Previous'}</span> }
            {
                pageNumbers.map((pageNum, index) => (
                <span key={index} className={pageNum === props.currentPage ? "active": ""} onClick={() => {props.setPage(pageNum)}}>
                    {pageNum}
                </span>
                ))
            }
            {props.currentPage < pageNumbers.length && <span onClick={() => {props.setPage(props.currentPage + 1)}}> {'Next'}</span>}
        </div>
    )
    
}

export default registrationPaginator;