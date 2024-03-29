import React, { Component } from 'react';

export default class Pagination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalItems: 0,
            currentPage: 0,
            pageSize: 0,
            totalPages: 0,
            startPage: 0,
            endPage: 0,
            startIndex: 0,
            endIndex: 0,
            pages: []
        }
        this.paginate = this.paginate.bind(this)
    }

    componentDidMount() {
        this.paginate(this.props.totalItems, this.props.currentPage, this.props.pageSize, this.props.maxPages)
    }
    paginate(totalItems, currentPage, pageSize, maxPages, callback) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage, endPage;
        if (totalPages <= maxPages) {
            // total pages less than max so show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // total pages more than max so calculate start and end pages
            let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
            let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                // current page near the start
                startPage = 1;
                endPage = maxPages;
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                // current page near the end
                startPage = totalPages - maxPages + 1;
                endPage = totalPages;
            } else {
                // current page somewhere in the middle
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;

        console.log((currentPage - 1) * pageSize)
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        this.setState({
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        }, () => this.props.callParent())

    }
    render() {
        const pages = (this.state.pages.length > 0 ? (this.state.pages.map(dt =>
            <li className="page-item"><p onClick={() => this.props.pageFunction(dt, this.paginate)} className="page-link" >{dt}</p></li>
        )) : (<li></li>))
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">

                    {pages}

                </ul>
            </nav>
        )
    }
}