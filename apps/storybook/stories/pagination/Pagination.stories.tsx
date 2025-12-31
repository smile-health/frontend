/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import {
  Pagination,
  PaginationContainer,
  PaginationInfo,
  PaginationSelectLimit,
} from '@repo/ui/components/pagination'

const meta = {
  title: 'Navigation/Pagination',
}

export default meta

export const BasicUsage = {
  args: {
    currentPage: 1,
    totalPages: 10000,
  },
  render: (args: Record<string, any>) => {
    const [currentPage, setCurrentPage] = React.useState(args.currentPage)

    return (
      <PaginationContainer>
        <Pagination
          totalPages={args.totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </PaginationContainer>
    )
  },
}

export const WithSelectLimit = {
  args: {
    perPagesOptions: [5, 10],
    currentPage: 1,
    size: 10,
    totalData: 10000,
  },
  render: (args: Record<string, any>) => {
    const [currentPage, setCurrentPage] = React.useState(args.currentPage)
    const [limit, setLimit] = React.useState(args.size)

    const totalPages = Math.ceil(args.totalData / limit)

    return (
      <PaginationContainer>
        <PaginationSelectLimit
          size={limit}
          onChange={setLimit}
          perPagesOptions={args.perPagesOptions}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </PaginationContainer>
    )
  },
}

export const WithSelectLimitAndInfo = {
  args: {
    currentPage: 1,
    size: 10,
    totalData: 10000,
  },
  render: (args: Record<string, any>) => {
    const [currentPage, setCurrentPage] = React.useState(args.currentPage)
    const [limit, setLimit] = React.useState(args.size)

    const totalPages = Math.ceil(args.totalData / limit)

    return (
      <PaginationContainer>
        <PaginationSelectLimit
          size={limit}
          onChange={setLimit}
          perPagesOptions={args.perPagesOptions}
        />
        <PaginationInfo
          currentPage={currentPage}
          size={limit}
          total={args.totalData}
        />
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </PaginationContainer>
    )
  },
}
