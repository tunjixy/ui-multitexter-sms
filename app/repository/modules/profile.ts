import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  ProfileRes,
  ProfileSummaryRes,
  UpdateProfileReq,
  UpdateProfileRes,
} from '@/types/profile'

export const ProfileApi = (http: HttpClient) => ({
  fetchProfile: () => http.get<ProfileRes>(apiRoutes.profile.bio),
  fetchProfileSummary: () =>
    http.get<ProfileSummaryRes>(apiRoutes.profile.summary),
  updateProfile: (body: UpdateProfileReq) =>
    http.post<UpdateProfileRes>(apiRoutes.profile.update, body),
})
