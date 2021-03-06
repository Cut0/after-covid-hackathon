import { reactive, toRefs } from '@vue/composition-api'
import NotificationModel from '@/models/firebase/NotificationModel'
import { Notification } from '@/types'
export default () => {
  const perPage = 20
  let cursor = 0
  let isLast = false
  const state = reactive({
    loading: false,
    notifications: [] as Notification[]
  })

  async function reset() {
    state.notifications = []
    cursor = 0
    isLast = false
  }

  function createQuery() {
    return {
      offset: cursor,
      limit: cursor + perPage - 1
    }
  }

  async function getList() {
    if (isLast || state.loading) return
    state.loading = true
    return new NotificationModel()
      .getList(createQuery())
      .then((res: any) => {
        state.notifications.push(...res.data)
      })
      .finally(() => {
        state.loading = false
      })
  }

  async function getAll() {
    if (isLast || state.loading) return
    state.loading = true
    return await new NotificationModel()
      .getAll()
      .then((res: any) => {
        state.notifications.push(...res.data)
      })
      .finally(() => {
        state.loading = false
      })
  }

  return {
    ...toRefs(state),
    getAll
  }
}
