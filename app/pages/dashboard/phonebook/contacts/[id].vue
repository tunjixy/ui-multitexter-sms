<template>
  <div class="py-6">
    <div class="dashboard-wrapper">
      <NuxtLink
        to="/dashboard/phonebook"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-primary/35 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium transition-colors outline-none focus-visible:ring-2"
      >
        <ArrowLeftIcon class="size-4" />
        Phonebook
      </NuxtLink>

      <template v-if="loading && !list">
        <UiSkeleton class="mt-4 h-8 w-56 rounded-lg" />
        <UiSkeleton class="mt-2 h-4 w-80 max-w-full rounded" />
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <UiSkeleton v-for="n in 5" :key="n" class="h-24 w-full rounded-xl" />
        </div>
        <div class="mt-8 space-y-3">
          <UiSkeleton v-for="n in 5" :key="n" class="h-12 w-full rounded-lg" />
        </div>
      </template>

      <UiErrorState
        v-else-if="error"
        class="mt-6"
        @try-again="fetchResources"
      />

      <EmptyState
        v-else-if="!list"
        class="mt-6"
        :icon="SearchXIcon"
        title="We couldn't find this list"
        description="It may have been deleted. Go back to your phonebook to see the lists you have."
      >
        <template #actions>
          <UiButton
            variant="outline"
            radius="lg"
            @click="navigateTo('/dashboard/phonebook')"
          >
            Back to phonebook
          </UiButton>
        </template>
      </EmptyState>

      <template v-else>
        <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div class="min-w-0">
            <h1 class="text-2xl font-bold tracking-tight wrap-break-word">
              {{ list.contactist_name }}
            </h1>
            <p class="text-muted-foreground mt-1 max-w-xl text-sm">
              {{ list.description || 'Every number saved in this list.' }}
            </p>
            <p v-if="created" class="text-muted-foreground mt-1 text-xs">
              Created {{ created }}
            </p>
          </div>
          <div class="flex gap-3">
            <UiDropdownMenu
              :items="listMenu"
              placement="end"
              @select="onListAction"
            >
              <UiButton
                variant="outline"
                radius="lg"
                aria-label="List actions"
                class="w-10 px-0!"
              >
                <EllipsisIcon class="size-4" />
              </UiButton>
            </UiDropdownMenu>
            <UiButton radius="lg" @click="adding = true">
              <template #leading>
                <PlusIcon class="size-4" />
              </template>
              Add contact
            </UiButton>
          </div>
        </div>

        <template v-if="listTotal">
          <ul class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <li class="border-primary/30 bg-primary/5 rounded-xl border p-4">
              <p class="text-muted-foreground text-xs font-medium">
                All contacts
              </p>
              <p class="mt-2 text-xl font-bold tracking-tight">
                {{ formatNumberWithComma(listTotal) }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-xs">In this list</p>
            </li>
            <li
              v-for="network in networkStats"
              :key="network.networkid"
              class="border-border bg-surface rounded-xl border p-4"
            >
              <p class="text-muted-foreground truncate text-xs font-medium">
                {{ network.network }}
              </p>
              <p class="mt-2 text-xl font-bold tracking-tight">
                {{ formatNumberWithComma(network.total) }}
              </p>
              <p class="text-muted-foreground mt-0.5 text-xs">
                {{ network.share }}% of list
              </p>
            </li>
          </ul>

          <section class="mt-8">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-lg font-semibold">Numbers</h2>
              <div class="w-full sm:max-w-xs">
                <UiInput
                  v-model="search"
                  type="search"
                  inputmode="tel"
                  placeholder="Search numbers…"
                  :disabled="refreshing"
                >
                  <template #leading>
                    <SearchIcon class="text-muted-foreground size-4" />
                  </template>
                </UiInput>
              </div>
            </div>

            <EmptyState
              v-if="!contacts.length"
              class="mt-4"
              :icon="SearchXIcon"
              title="No matching numbers"
              :description="`Nothing in this list matches “${search.trim()}”.`"
            >
              <template #actions>
                <UiButton variant="outline" radius="lg" @click="search = ''">
                  Clear search
                </UiButton>
              </template>
            </EmptyState>

            <div
              v-else
              :class="[
                'border-border mt-4 overflow-hidden rounded-lg border transition-opacity',
                refreshing && 'pointer-events-none opacity-60',
              ]"
            >
              <UiTable>
                <TableHeader>
                  <TableRow>
                    <TableHead v-for="heading in headings" :key="heading">
                      {{ heading }}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="row in rows" :key="row.contact.contactid">
                    <TableCell class="text-muted-foreground w-12">
                      {{ row.number }}.
                    </TableCell>
                    <TableCell class="font-medium tabular-nums">
                      {{ row.contact.mobilenumber }}
                    </TableCell>
                    <TableCell class="w-16">
                      <button
                        type="button"
                        :aria-label="`Remove ${row.contact.mobilenumber}`"
                        class="text-muted-foreground focus-visible:ring-primary/35 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none hover:bg-red-600/10 hover:text-red-600 focus-visible:ring-3 dark:hover:text-red-400"
                        @click="removeContact(row.contact)"
                      >
                        <Trash2Icon class="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </UiTable>

              <UiPagination
                v-if="totalPages > 1"
                :current-page="currentPage"
                :total-pages="totalPages"
                @previous="reload(currentPage - 1)"
                @next="reload(currentPage + 1)"
                @goto="reload"
              />
            </div>
          </section>
        </template>

        <EmptyState
          v-else
          class="mt-6"
          :icon="ContactIcon"
          title="No contacts yet"
          description="Add the numbers you want in this list. You can text them all at once when you compose an SMS."
        >
          <template #actions>
            <UiButton radius="lg" @click="adding = true">
              <template #leading>
                <PlusIcon class="size-4" />
              </template>
              Add contact
            </UiButton>
          </template>
        </EmptyState>

        <AddContactModal
          v-model:open="adding"
          :list-id="listId"
          :list-name="list.contactist_name"
          @saved="onContactAdded"
        />
        <ModifyListModal
          v-model:open="editing"
          :list="list"
          @saved="onListSaved"
        />
        <DeleteListModal
          v-model:open="deletingList"
          :list="list"
          @deleted="navigateTo('/dashboard/phonebook')"
        />
        <DeleteContactModal
          v-model:open="deletingContact"
          :contact="selectedContact"
          :list-name="list.contactist_name"
          @deleted="onContactDeleted"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ContactIcon,
  EllipsisIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SearchXIcon,
  Trash2Icon,
} from '@lucide/vue'
import { apiClient } from '@/repository/api'
import type {
  Contact,
  ContactList,
  ContactNetworkCount,
  CreateContactListReq,
} from '@/types/phonebook'
import type {
  DropdownMenuAction,
  DropdownMenuItem,
} from '@/components/ui/UiDropdownMenu.vue'

useAppStore().setPageTitle('Contacts')

const { $toast } = useNuxtApp()
const listId = Number(useRoute().params.id)

const headings = ['', 'Phone number', 'Action']
const listMenu: DropdownMenuItem[] = [
  { id: 'edit', label: 'Edit list', icon: PencilIcon },
  { type: 'divider' },
  { id: 'delete', label: 'Delete list', icon: Trash2Icon, danger: true },
]

const list = ref<ContactList | null>(null)
const networks = ref<ContactNetworkCount[]>([])
const contacts = ref<Contact[]>([])
const listTotal = ref(0)
const currentPage = ref(1)
const perPage = ref(0)
const total = ref(0)
const search = ref('')
const loading = ref(true)
const refreshing = ref(false)
const error = ref(false)

const adding = ref(false)
const editing = ref(false)
const deletingList = ref(false)
const deletingContact = ref(false)
const selectedContact = ref<Contact | null>(null)

const totalPages = computed(() =>
  perPage.value ? Math.ceil(total.value / perPage.value) : 1,
)

const created = computed(() =>
  list.value?.created
    ? useDateFormat(list.value.created, 'Do MMMM YYYY').value
    : '',
)

const networkStats = computed(() => {
  const sum = networks.value.reduce(
    (count, network) => count + Number(network.total),
    0,
  )
  return networks.value.map((network) => ({
    ...network,
    share: sum ? Math.round((Number(network.total) / sum) * 100) : 0,
  }))
})

const rows = computed(() =>
  contacts.value.map((contact, index) => ({
    contact,
    number: incrementPageNumber(index, perPage.value, currentPage.value),
  })),
)

let lastRequest = 0
let appliedQuery: string | null = ''

const fetchContacts = async (page = 1) => {
  const query = search.value.trim()
  const request = ++lastRequest
  appliedQuery = query
  try {
    const response = query
      ? await apiClient.phonebook.searchContacts({ listId, page, search: query })
      : await apiClient.phonebook.fetchContacts({ listId, page })
    if (request !== lastRequest) return

    const ok = response.status === 1
    contacts.value = ok ? (response.data ?? []) : []
    perPage.value = ok ? response.rows : 0
    total.value = ok ? response.total : 0
    currentPage.value = page
    if (!query) listTotal.value = total.value
  } catch (err) {
    if (request === lastRequest) appliedQuery = null
    throw err
  }
}

const fetchNetworks = async () => {
  const response = await apiClient.phonebook.fetchContactNetworkCount(listId)
  networks.value = response.status === 1 ? (response.data ?? []) : []
}

const fetchResources = async () => {
  try {
    loading.value = true
    error.value = false
    const [lists] = await Promise.all([
      apiClient.phonebook.fetchContactLists(),
      fetchNetworks(),
      fetchContacts(1),
    ])
    list.value =
      lists.status === 1
        ? (lists.data.find((item) => Number(item.contactlistid) === listId) ??
          null)
        : null
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const reload = async (page: number, withNetworks = false) => {
  try {
    refreshing.value = true
    await Promise.all([
      fetchContacts(page),
      withNetworks ? fetchNetworks() : null,
    ])
  } catch (err) {
    $toast.error(formatErrorResponse(err))
  } finally {
    refreshing.value = false
  }
}

watchDebounced(
  search,
  (value) => {
    if (value.trim() !== appliedQuery) reload(1)
  },
  { debounce: 1000 },
)

const onListAction = ({ id }: DropdownMenuAction) => {
  if (id === 'edit') editing.value = true
  else if (id === 'delete') deletingList.value = true
}

const onListSaved = ({ name, description }: CreateContactListReq) => {
  if (!list.value) return
  list.value = {
    ...list.value,
    contactist_name: name,
    description: description ?? '',
  }
}

const onContactAdded = () => {
  search.value = ''
  reload(1, true)
}

const removeContact = (contact: Contact) => {
  selectedContact.value = contact
  deletingContact.value = true
}

const onContactDeleted = () => {
  if (search.value.trim()) listTotal.value = Math.max(0, listTotal.value - 1)
  const goToPreviousPage = contacts.value.length === 1 && currentPage.value > 1
  reload(goToPreviousPage ? currentPage.value - 1 : currentPage.value, true)
}

onMounted(fetchResources)

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useHead({
  title: 'Contacts',
})
</script>
