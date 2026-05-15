export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ memberId: string }>(event)
  if (!body?.memberId) {
    throw createError({ statusCode: 400, message: 'memberId requis' })
  }
  const result = confirmOrder(id, body.memberId)
  if (!result) {
    throw createError({ statusCode: 404, message: 'Session introuvable' })
  }
  return { allConfirmed: result.allConfirmed }
})
