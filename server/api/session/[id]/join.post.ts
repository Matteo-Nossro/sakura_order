export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ name: string }>(event)
  if (!body?.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Le prénom est requis' })
  }
  const result = joinSession(id, body.name.trim())
  if (!result) {
    throw createError({ statusCode: 404, message: 'Session introuvable ou expirée' })
  }
  return result
})
