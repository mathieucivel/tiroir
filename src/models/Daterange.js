const isDateValid = d => d instanceof Date && !isNaN(d)

export default function Daterange({ start = null, end = null }) {
  const daterange = {
    _start: new Date(start),
    _end: new Date(end),
  }

  function getStart() {
    return daterange._start
  }

  function setStart() {
    daterange._start = new Date(start)
  }

  function getEnd() {
    return daterange._end
  }

  function setEnd() {
    daterange._end = new Date(end)
  }

  function isValid() {
    return (
      isDateValid(daterange._start) &&
      isDateValid(daterange._end) &&
      daterange._start <= daterange._end
    )
  }

  Object.defineProperties(daterange, {
    start: { get: getStart, set: setStart },
    end: { get: getEnd, set: setEnd },
    isValid: { value: isValid },
  })
}

