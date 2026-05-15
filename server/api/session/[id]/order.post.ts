export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{
    memberId: string
    items: { menuItemId: string; quantity: number }[]
  }>(event)
  if (!body?.memberId) {
    throw createError({ statusCode: 400, message: 'memberId requis' })
  }
  const session = updateOrder(id, body.memberId, body.items ?? [])
  if (!session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }
  return { ok: true }
})
