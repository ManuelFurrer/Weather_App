let viewstate = {
  temperatureUnit: 'metric',
  country: 'CH',
  searchExpr: 'city'
}

export function setViewstate (fieldname, newValue) {
  viewstate[fieldname] = newValue
}

export function getViewstate (fieldname) {
  return viewstate?.[fieldname]
}
