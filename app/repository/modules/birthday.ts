import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  BirthdayRes,
  BirthdayCreateReq,
  BirthdayCreateRes,
  BirthdayStatusRes,
  UploadBirthdayRes,
  DeleteBirthdayRes,
} from '@/types/birthday'

export const BirthdayApi = (http: HttpClient) => ({
  fetchBirthdays: (page: number) =>
    http.get<BirthdayRes>(apiRoutes.birthday.lists(page)),
  createBirthday: (entries: BirthdayCreateReq[]) =>
    http.post<BirthdayCreateRes>(apiRoutes.birthday.create, {
      birthdayinputs: entries,
    }),
  editBirthday: (body: BirthdayCreateReq) =>
    http.post<BirthdayCreateRes>(apiRoutes.birthday.edit(body.id!), body),
  startBirthday: (birthdayId: number) =>
    http.post<BirthdayStatusRes>(apiRoutes.birthday.start(birthdayId)),
  stopBirthday: (birthdayId: number) =>
    http.post<BirthdayStatusRes>(apiRoutes.birthday.stop(birthdayId)),
  deleteBirthday: (birthdayId: number) =>
    http.post<DeleteBirthdayRes>(apiRoutes.birthday.delete(birthdayId)),
  uploadBirthday: (formData: FormData) =>
    http.post<UploadBirthdayRes>(apiRoutes.birthday.upload, formData),
})
