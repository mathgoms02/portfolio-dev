import { ui } from '../i18n/ui'
import type { L } from './types'

export interface SectionRef {
  id: string
  num: string
  label: L
}

export const SECTIONS: SectionRef[] = [
  { id: 'index', num: '00', label: ui.nav.index },
  { id: 'profile', num: '01', label: ui.nav.profile },
  { id: 'trajectory', num: '02', label: ui.nav.trajectory },
  { id: 'work', num: '03', label: ui.nav.work },
  { id: 'impact', num: '04', label: ui.nav.impact },
  { id: 'stack', num: '05', label: ui.nav.stack },
  { id: 'lab', num: '06', label: ui.nav.lab },
  { id: 'contact', num: '07', label: ui.nav.contact },
]
