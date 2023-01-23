
function makeUniq (str = '') {
  return str + Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

module.exports = {
  makeUniq,
  sleep
}
