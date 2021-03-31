import buildImage from './buildImage'
import buildShare from './buildShare'
import buildChannel from './buildChannel'
import buildLocation from './buildLocation'

export default {
  mixins: [
    buildImage,
    buildShare,
    buildChannel,
    buildLocation
  ]
}
