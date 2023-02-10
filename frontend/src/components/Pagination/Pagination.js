import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ButtonDropdown, Col, DropdownToggle, DropdownItem, DropdownMenu,
  PaginationLink, PaginationItem, Pagination as BSPagination, Row } from 'reactstrap'
import { getPageCount } from 'helpers'

export default class Pagination extends Component {
  static propTypes = {
    pagination: PropTypes.object,
    setPagination: PropTypes.func,
  };

  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false
    }
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  handlePageClick = (page) => () => {
    const { pagination, setPagination } = this.props
    if (page === 'prev') {
      page = Math.max(1, pagination.page - 1)
    }
    if (page === 'next') {
      page = Math.min(getPageCount(pagination), pagination.page + 1)
    }

    if (page !== pagination.page) {
      setPagination({ page })
    }
  }

  handlePageSize = (pageSize) => () => {
    const { pagination, setPagination } = this.props
    if (pageSize !== pagination.page_size) {
      setPagination({
        page_size: pageSize,
        page: 1
      })
    }
  }

  render () {
    const { pagination } = this.props
    const pageCount = getPageCount(pagination)
    const pages = new Array(pageCount).fill(0)

    return (
      <Row style={{ justifyContent: 'center' }}>
        <Col xs='auto' className='pr-1 pl-1'>
          <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} dropup>
            <DropdownToggle caret>
              {pagination.page_size}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.handlePageSize(2)}>2</DropdownItem>
              <DropdownItem onClick={this.handlePageSize(5)}>5</DropdownItem>
              <DropdownItem onClick={this.handlePageSize(10)}>10</DropdownItem>
              <DropdownItem onClick={this.handlePageSize(20)}>20</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </Col>
        <Col xs='auto' className='pr-1 pl-1'>
          <BSPagination>
            <PaginationItem>
              <PaginationLink previous tag='button' onClick={this.handlePageClick('prev')}
                disabled={pagination.page === 1} />
            </PaginationItem>
            {pages.map((item, index) => (
              <PaginationItem key={index} active={index + 1 === pagination.page}>
                <PaginationLink tag='button' onClick={this.handlePageClick(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink next tag='button' onClick={this.handlePageClick('next')}
                disabled={pagination.page === pageCount} />
            </PaginationItem>
          </BSPagination>
        </Col>
      </Row>
    )
  }
}
