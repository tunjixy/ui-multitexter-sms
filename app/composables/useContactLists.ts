import * as Yup from 'yup'
import { apiClient } from '@/repository/api'
import type { ContactList } from '@/types/phonebook'

export type ContactListMode = 'create' | 'add'

export const contactListFields = {
  mode: Yup.string<ContactListMode>().required(),
  listName: Yup.string()
    .trim()
    .when('mode', {
      is: 'create',
      then: (schema) => schema.required('Enter a name for the new list'),
    }),
  listId: Yup.number()
    .nullable()
    .when('mode', {
      is: 'add',
      then: (schema) => schema.required('Choose a list'),
    }),
}

export default function useContactLists() {
  const lists = useState<ContactList[] | null>('contact-lists', () => null)
  const loading = useState('contact-lists-loading', () => false)
  const error = useState('contact-lists-error', () => false)

  const fetchContactLists = async () => {
    try {
      loading.value = true
      error.value = false
      const response = await apiClient.phonebook.fetchContactLists()
      lists.value = response.status === 1 ? (response.data ?? []) : []
    } catch {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return { lists, loading, error, fetchContactLists }
}
