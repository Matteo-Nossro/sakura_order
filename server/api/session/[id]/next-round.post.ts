export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ memberId: string }>(event)
  if (!body?.memberId) {
    throw createError({ statusCode: 400, message: 'memberId requis' })
  }
  const session = startNewRound(id, body.memberId)
  if (!session) {
    throw createError({ statusCode: 403, message: 'Non autorisé ou session introuvable' })
  }
  return { roundIndex: session.currentRoundIndex }
})
