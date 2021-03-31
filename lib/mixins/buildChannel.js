import { STATICDOMAIN, IMAGESDOMAIN, nykj_cid, CCBCID, ABCCID, ABCTOTALCID } from '@/config/GlobalSetting.js'

window.STATICDOMAIN = STATICDOMAIN
window.IMAGESDOMAIN = IMAGESDOMAIN

import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      STATICDOMAIN: STATICDOMAIN,
      IMAGESDOMAIN: IMAGESDOMAIN,
      NYKJCIDANDROID: nykj_cid.android,
      NYKJCIDIOS: nykj_cid.ios,
      CCBCID: CCBCID,
      ABCCID: ABCCID,
      ABCTOTALCID: ABCTOTALCID,
      ABCHeight: 0,
      cid: '',
      urlcid: ''
    }
  },
  computed: {
    ...mapGetters(['OSSTESTIMG'])
  },
}
