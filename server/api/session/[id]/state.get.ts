export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const session = findSession(id)
  if (!session) {
    throw createError({ statusCode: 404, message: 'Session introuvable ou expirée' })
  }
  return session
})
