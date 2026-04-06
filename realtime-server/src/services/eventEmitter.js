const redis = require('./config/redis')

const EventEmitter = {
  async emit(event, data) {
    await redis.publish('events', JSON.stringify({ event, data }))
  },

  async emitToUser(userId, event, data) {
    await redis.publish(`user:${userId}`, JSON.stringify({ event, data }))
  },

  async emitToCampaign(campaignId, event, data) {
    await redis.publish(`campaign:${campaignId}`, JSON.stringify({ event, data }))
  },

  subscribe(channel, callback) {
    const subscriber = redis.duplicate()
    subscriber.subscribe(channel, (err) => {
      if (err) {
        console.error(`Failed to subscribe to ${channel}:`, err)
      }
    })
    subscriber.on('message', (msgChannel, message) => {
      if (msgChannel === channel && callback) {
        callback(JSON.parse(message))
      }
    })
    return subscriber
  },
}

module.exports = EventEmitter
