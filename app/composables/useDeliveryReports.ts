import { apiClient } from '@/repository/api'
import type { DeliveryReport, FilterDeliveryReportReq } from '@/types/report'

export type DeliveryReportFilters = Omit<FilterDeliveryReportReq, 'page'>

let lastRequest = 0
let lastPage = 1

export default function useDeliveryReports() {
  const reports = useState<DeliveryReport[] | null>(
    'delivery-reports',
    () => null,
  )
  const filters = useState<DeliveryReportFilters | null>(
    'delivery-report-filters',
    () => null,
  )
  const currentPage = useState('delivery-reports-page', () => 1)
  const perPage = useState('delivery-reports-per-page', () => 0)
  const total = useState('delivery-reports-total', () => 0)
  const loading = useState('delivery-reports-loading', () => false)
  const error = useState('delivery-reports-error', () => false)

  const totalPages = computed(() =>
    perPage.value ? Math.ceil(total.value / perPage.value) : 1,
  )

  const fetchReports = async (page = lastPage) => {
    const request = ++lastRequest
    lastPage = page
    try {
      loading.value = true
      error.value = false
      const response = filters.value
        ? await apiClient.report.filterReport({ ...filters.value, page })
        : await apiClient.report.fetchReports(page)
      if (request !== lastRequest) return

      const ok = response.status === 1
      reports.value = ok ? (response.data ?? []) : []
      perPage.value = ok ? response.rows : 0
      total.value = ok ? response.total : 0
      currentPage.value = page
    } catch {
      if (request === lastRequest) error.value = true
    } finally {
      if (request === lastRequest) loading.value = false
    }
  }

  const applyFilters = (value: DeliveryReportFilters | null) => {
    filters.value = value
    return fetchReports(1)
  }

  return {
    reports,
    filters,
    currentPage,
    perPage,
    total,
    totalPages,
    loading,
    error,
    fetchReports,
    applyFilters,
  }
}
