<template>
  <div>
    <DashboardSidebar :menus="menus" />
    <DashboardSideDrawer
      :menus="menus"
      :show="toggleDrawer"
      @close="toggleDrawer = false"
    />
    <div class="dashboard relative lg:ml-60">
      <DashboardHeader @toggle="toggleDrawer = true" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  MessageSquarePlus,
  ListOrdered,
  MessageSquareDot,
  MessageSquareText,
  CalendarClock,
  Send,
  FilePen,
  FileDown,
  FileCheck,
  CreditCard,
  Landmark,
  Share2,
  BookUser,
  Upload,
  History,
  Bell,
  Gift,
  Tag,
  Cake,
} from '@lucide/vue'
import type { Menu } from '@/types/dashboard'

const menus = ref<Menu[]>([
  {
    title: 'Dashboard',
    icon: markRaw(LayoutDashboard),
    url: '/dashboard',
  },
  {
    title: 'Message',
    showMenu: true,
    subMenus: [
      {
        title: 'Compose SMS',
        icon: markRaw(MessageSquarePlus),
        url: '/dashboard/compose-sms',
      },
      {
        title: 'Queued Messages',
        icon: markRaw(ListOrdered),
        url: '/dashboard/queued-sms',
      },
      {
        title: 'SMS Status',
        icon: markRaw(MessageSquareDot),
        url: '/dashboard/sent-sms-status',
      },
      {
        title: 'Personalized SMS',
        icon: markRaw(MessageSquareText),
        url: '/dashboard/personalized-sms',
      },
      {
        title: 'Scheduled SMS',
        icon: markRaw(CalendarClock),
        url: '/dashboard/scheduled-sms',
      },
      {
        title: 'Sent SMS',
        icon: markRaw(Send),
        url: '/dashboard/sent-messages',
      },
      {
        title: 'Drafts',
        icon: markRaw(FilePen),
        url: '/dashboard/drafts',
      },
      {
        title: 'Download Reports',
        icon: markRaw(FileDown),
        url: '/dashboard/download-report',
      },
      {
        title: 'Delivery Reports',
        icon: markRaw(FileCheck),
        url: '/dashboard/delivery-reports',
      },
    ],
  },
  {
    title: 'Credit',
    showMenu: false,
    subMenus: [
      {
        title: 'Buy Unit',
        icon: markRaw(CreditCard),
        url: '/dashboard/buy-sms-online',
      },
      {
        title: 'Deposit',
        icon: markRaw(Landmark),
        url: '/dashboard/bank-deposit',
      },
      {
        title: 'Share Credit',
        icon: markRaw(Share2),
        url: '/dashboard/share-credit',
      },
    ],
  },
  {
    title: 'Contact',
    showMenu: false,
    subMenus: [
      {
        title: 'My Phonebook',
        icon: markRaw(BookUser),
        url: '/dashboard/phonebook',
      },
      {
        title: 'Contacts',
        icon: markRaw(Upload),
        url: '/dashboard/contacts',
      },
    ],
  },
  {
    title: 'Others',
    showMenu: false,
    subMenus: [
      {
        title: 'History',
        icon: markRaw(History),
        url: '/dashboard/history',
      },
      {
        title: 'Alert',
        icon: markRaw(Bell),
        url: '/dashboard/alert',
      },
      {
        title: 'Refer a Friend',
        icon: markRaw(Gift),
        url: '/dashboard/refer',
      },
      {
        title: 'Pricing',
        icon: markRaw(Tag),
        url: '/pricing',
      },
      {
        title: 'Birthdays',
        icon: markRaw(Cake),
        url: '/dashboard/birthdays',
      },
    ],
  },
])
const toggleDrawer = ref(false)
</script>
