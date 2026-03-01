import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

export { useUserStore } from './user'
export { useRecordStore } from './record'
export { useTreeStore } from './tree'
