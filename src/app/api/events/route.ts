import { sseBroker } from '@/lib/sse'
import { NextRequest } from 'next/server'
import type { QuotaUpdatePayload } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`),
      )

      const listener = (data: QuotaUpdatePayload) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      sseBroker.on('quota_updated', listener)

      req.signal.addEventListener('abort', () => {
        sseBroker.off('quota_updated', listener)
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
