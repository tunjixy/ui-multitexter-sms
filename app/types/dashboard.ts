import type { LucideIcon } from '@lucide/vue'

export interface MenuLink {
  title: string
  icon: LucideIcon
  url: string
}

export interface MenuGroup {
  title: string
  showMenu: boolean
  subMenus: MenuLink[]
}

export type Menu = MenuLink | MenuGroup
