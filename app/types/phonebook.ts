export interface ContactList {
  contactCount: string
  contactist_name: string
  contactlistid: number
  created: string
  description: string
}

export interface ContactListRes {
  data: ContactList[]
  status: number
  page: number
  rows: number
  total: number
}

export interface CreateContactListReq {
  name: string
  description?: string
  listId?: number
}

export interface CreateContactListRes {
  status: number
  msg: string
}

export interface ContactParam {
  listId: number
  page: number
  search?: string
}

export interface Contact {
  contactid: number
  contactlist_name: string
  id: number
  mobilenumber: string
}

export interface ContactRes {
  data: Contact[]
  page: number
  rows: number
  total: number
  status: number
}

export interface CreateContactReq {
  mobilenumber: string
  contactlistid?: number
  contactlistname?: string
}

export interface CreateContactRes {
  status: number
  msg: string
}

export interface ContactNetworkCount {
  network: string
  networkid: number
  total: number
}

export interface ContactNetworkCountRes {
  data: ContactNetworkCount[]
  status: number
}

export interface DeleteRes {
  msg: string
  status: number
}
