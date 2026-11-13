import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  ContactListRes,
  CreateContactListReq,
  CreateContactListRes,
  ContactRes,
  ContactParam,
  ContactNetworkCountRes,
  CreateContactReq,
  CreateContactRes,
  DeleteRes,
} from '@/types/phonebook'

export const PhonebookApi = (http: HttpClient) => ({
  fetchContactLists: (page?: number) =>
    http.get<ContactListRes>(apiRoutes.phonebook.contactLists(page)),
  createContactList: (body: CreateContactListReq) =>
    http.post<CreateContactListRes>(apiRoutes.phonebook.createList, body),
  updateContactList: ({ listId, ...body }: CreateContactListReq) =>
    http.post<CreateContactListRes>(
      apiRoutes.phonebook.updateList(listId!),
      body,
    ),
  deleteContactList: (listId: number) =>
    http.post<DeleteRes>(apiRoutes.phonebook.deleteList, {
      contactlistid: listId,
    }),
  fetchContacts: (param: ContactParam) =>
    http.get<ContactRes>(
      apiRoutes.phonebook.contacts(param.listId, param.page),
    ),
  fetchContactNetworkCount: (listId: number) =>
    http.post<ContactNetworkCountRes>(
      apiRoutes.phonebook.contactNetworkCount(listId),
    ),
  createContact: (body: CreateContactReq) =>
    http.post<CreateContactRes>(apiRoutes.phonebook.createContact, body),
  uploadContact: (formData: FormData) =>
    http.post<CreateContactRes>(apiRoutes.phonebook.uploadContact, formData),
  searchContacts: (param: ContactParam) =>
    http.post<ContactRes>(
      apiRoutes.phonebook.searchContacts(param.listId, param.page),
      {
        search: param.search,
      },
    ),
  deleteContact: (contactId: number) =>
    http.post<DeleteRes>(apiRoutes.phonebook.deleteContact, {
      contacts: contactId,
    }),
})
