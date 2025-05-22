import React from 'react'

/**
 * Determines the color for a given count of events.
 * @param {number} count - The number of events.
 * @returns {string} - The color corresponding to the count of events.
 */
function getColor(count) {
  if (!count) return '#fff' // white for no events
  if (count === 1) return '#b6f2c1' // light green
  if (count === 2) return '#6ee7a7' // medium-light green
  if (count <= 4) return '#22c55e' // medium green
  return '#15803d' // dark green
}

/**
 * Generates an array of date strings for the specified number of weeks, starting from the beginning of the week (Monday).
 * @param {number} [weeks=52] - The number of weeks to generate dates for.
 * @returns {string[]} - An array of date strings in the format 'YYYY-MM-DD'.
 */
function getDateRange(weeks = 52) {
  const days = []
  const today = new Date()
  // Start from the beginning of the week (Monday)
  const start = new Date(today)
  start.setDate(
    today.getDate() - ((today.getDay() - 1 + 7) % 7) - (weeks - 1) * 7
  )
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

/**
 * ActivityGrid component displays a grid of activities grouped by date.
 * @param {Object} props
 * @param {Object} props.grouped - An object where keys are dates (YYYY-MM-DD) and values are the count of records for that date.
 */
const ActivityGrid = ({ grouped }) => {
  const days = getDateRange(52)
  // Arrange days into columns (weeks)
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  // Prepare month labels
  const monthLabels = []
  let lastMonth = null
  weeks.forEach((week, wi) => {
    const firstDay = week[0]
    const month = new Date(firstDay).getMonth()
    if (month !== lastMonth) {
      monthLabels[wi] = new Date(firstDay).toLocaleString('en-US', {
        month: 'short'
      })
      lastMonth = month
    } else {
      monthLabels[wi] = ''
    }
  })
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Month legend */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          marginLeft: 0,
          marginBottom: 2,
          fontSize: 10,
          color: '#888'
        }}
      >
        {monthLabels.map((label, i) => (
          <div key={i} style={{ width: 12, textAlign: 'center' }}>
            {label}
          </div>
        ))}
      </div>
      {/* Activity grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          marginBottom: 16
        }}
      >
        {weeks.map((week, wi) => (
          <div
            key={wi}
            style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {week.map(date => (
              <div
                key={date}
                title={`${date}: ${grouped[date] || 0} record(s)`}
                style={{
                  width: 12,
                  height: 12,
                  background: getColor(grouped[date]),
                  borderRadius: 2,
                  border: '1px solid #e5e7eb',
                  boxSizing: 'border-box'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityGrid
