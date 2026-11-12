import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type { AlertRes, EditAlertReq, EditAlertRes } from '~/types/alert'

export const AlertApi = (http: HttpClient) => ({
  fetchAlert: () => http.get<AlertRes>(apiRoutes.alert.alerts),
  editAlert: (body: EditAlertReq) =>
    http.post<EditAlertRes>(apiRoutes.alert.edit, body),
})
