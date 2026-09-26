export async function fetchAppState() {
  const res = await fetch('/api/state')
  if (!res.ok) throw new Error('Не удалось загрузить данные станций')
  return res.json()
}

export async function submitBooking(roundNumber: number, unionId: number) {
  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roundNumber, unionId }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка при выборе станции')
  return data
}

export async function confirmSchedule() {
  const res = await fetch('/api/confirm', {
    method: 'POST',
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка при подтверждении')
  return data
}
