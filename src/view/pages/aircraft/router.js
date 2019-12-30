import Record from './record/index' // 备案管理
import IEport from './iEport/index' // 进/出境/港申报
import InLare from './inLare/index' // 在港申报
import indexComponent from '@/view/pages/index.vue'

const MENU = [
  {
    path: '/aircraft/index',
    name: 'aircraft-index',
    hidden: false,
    permissions: 'WF000000',
    component: indexComponent,
    meta: {
      title: '首页'
    }
  },
  Record.MENU,
  IEport.MENU,
  InLare.MENU
]
export default {MENU}
