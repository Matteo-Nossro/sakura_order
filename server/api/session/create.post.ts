export default defineEventHandler(() => {
  const session = createSession()
  return { sessionId: session.id }
})
