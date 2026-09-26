'use client'
import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function useLiveQuotas() {
  const updateQuota = useStore((state) => state.updateQuota)

  useEffect(() => {
    const eventSource = new EventSource('/api/events')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (
          data.roundNumber &&
          data.unionId &&
          typeof data.remainingQuota === 'number'
        ) {
          updateQuota(data.roundNumber, data.unionId, data.remainingQuota)
        }
      } catch (err) {
        console.error('Ошибка парсинга SSE:', err)
      }
    }

    eventSource.onerror = () => {
      console.error('Сбой соединения SSE. Переподключение...')
    }

    return () => {
      eventSource.close()
    }
  }, [updateQuota])
}
