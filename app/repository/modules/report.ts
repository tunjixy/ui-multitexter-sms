import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  DeliveryReportRes,
  FilterDeliveryReportReq,
  DownloadReportReq,
  DownloadReportRes,
} from '@/types/report'

export const ReportApi = (http: HttpClient) => ({
  fetchReports: (page: number) =>
    http.get<DeliveryReportRes>(apiRoutes.report.lists(page)),
  filterReport: (body: FilterDeliveryReportReq) =>
    http.post<DeliveryReportRes>(apiRoutes.report.filter(body.page!), {
      delivery_status: body.status,
      endfrom: body.endDate,
      recipient: body.recipient,
      sender: body.sender,
      startfrom: body.startDate,
    }),
  downloadReport: (body: DownloadReportReq) =>
    http.post<DownloadReportRes>(apiRoutes.report.download, {
      startfrom: body.startDate,
      endfrom: body.endDate,
      sender: body.senderName,
      delivery_status: body.status,
    }),
})
