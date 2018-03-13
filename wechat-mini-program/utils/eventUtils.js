let events = [];

const event = (name, data) => {
  let eventsArray = events[name]
  eventsArray && eventsArray.forEach(fn => fn(data))
}

const on = (name, fn) => {
  if (typeof fn === 'function') {
    if (!events[name]) events[name] = []
    events[name].push(fn)
  }
}

export default {
  event: event,
  on: on,
  events: events
}