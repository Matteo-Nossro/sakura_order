export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ memberId: string }>(event)
  if (!body?.memberId) {
    throw createError({ statusCode: 400, message: 'memberId requis' })
  }
  const session = unconfirmOrder(id, body.memberId)
  if (!session) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }
  return { ok: true }
})
