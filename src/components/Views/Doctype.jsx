import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useClient, Q } from 'cozy-client'
import Alert from 'cozy-ui/transpiled/react/Alert'
import Button from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import Stack from 'cozy-ui/transpiled/react/Stack'

import { getFormatter } from '../../formatters'

export const Doctype = () => {
  const { doctype } = useParams()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalCount: 0
  })
  const client = useClient()

  const fetchData = async (page = 0) => {
    setIsLoading(true)
    setError(null)
    try {
      // Get total count for pagination
      const countResponse = await client.query(Q(doctype).limitBy(1))
      const totalCount = countResponse.meta?.count || 0

      // Get data for current page
      const skip = page * pagination.pageSize
      const query = Q(doctype).limitBy(pagination.pageSize).offset(skip)
      const result = await client.query(query)

      setData(result.data)
      setPagination({
        ...pagination,
        currentPage: page,
        totalCount
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data', error)
      setError(error.message || 'An error occurred while fetching data')
      // Reset data and pagination when an error occurs
      setData(null)
      setPagination({
        ...pagination,
        currentPage: 0,
        totalCount: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [client, doctype]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextPage = () => {
    fetchData(pagination.currentPage + 1)
  }

  const handlePrevPage = () => {
    if (pagination.currentPage > 0) {
      fetchData(pagination.currentPage - 1)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="u-p-1">
        <Icon icon={SpinnerIcon} spin />
      </div>
    )
  }

  // Get the appropriate formatter for this doctype
  const formatter = getFormatter(doctype)

  // Calculate pagination info
  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize)
  const startItem = pagination.currentPage * pagination.pageSize + 1
  const endItem = Math.min(
    (pagination.currentPage + 1) * pagination.pageSize,
    pagination.totalCount
  )
  const hasNextPage = pagination.currentPage < totalPages - 1
  const hasPrevPage = pagination.currentPage > 0

  return (
    <div className="u-p-2">
      <h1>{doctype}</h1>

      {error && (
        <Alert className="u-mb-1" severity="error">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="u-p-1">
          <Icon icon={SpinnerIcon} spin />
        </div>
      ) : (
        <>
          {data && formatter(data, fetchData)}

          {!error && data && (
            <Stack className="u-mt-1" spacing="s">
              <div>
                {pagination.totalCount > 0 && (
                  <div className="u-ta-center">
                    Showing {startItem} to {endItem} of {pagination.totalCount}{' '}
                    documents
                  </div>
                )}
              </div>

              <div className="u-flex u-flex-justify-center u-mt-half">
                <Button
                  variant="secondary"
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage}
                  className="u-mr-1"
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            </Stack>
          )}
        </>
      )}
    </div>
  )
}
