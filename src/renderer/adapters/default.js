exports.format = function (data) {
  return JSON.stringify(data)
}

exports.find = function (list, identity) {
  return list.find((item) => item.id === identity)
}
