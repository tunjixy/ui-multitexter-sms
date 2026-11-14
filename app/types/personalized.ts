export interface UploadTemplateRes {
  status: number
  msg: string
  display: string
  filename: string
  fileurl: string
}

export interface PersonalizedTemplate {
  name: string
  fileUrl: string
  filename: string
  message: string
}

export interface PreviewMessageReq {
  url: string
  filename: string
  message: string
}

export interface PreviewMessageRes {
  data: string
  msg: string
  status: number
}

export interface SendMessageReq {
  fileUrl: string
  filename: string
  message: string
  displayname: string
  dnd: number
}

export interface SendMessageRes {
  status: number
  msg: string
  bulk_id: string
}
