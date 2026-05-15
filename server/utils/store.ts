import { randomBytes } from 'node:crypto'

export interface Member {
  id: string
  name: string
}

export interface OrderItem {
  menuItemId: string
  quantity: number
}

export interface RoundOrder {
  items: OrderItem[]
  confirmed: boolean
}

export interface Round {
  id: string
  orders: Record<string, RoundOrder>
}

export interface Session {
  id: string
  createdAt: number
  expiresAt: number
  hostId: string
  members: Member[]
  rounds: Round[]
  currentRoundIndex: number
}

const SESSION_TTL = 6 * 60 * 60 * 1000
const sessions = new Map<string, Session>()

function uid(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

function sweep() {
  const now = Date.now()
  for (const [k, v] of sessions) {
    if (v.expiresAt < now) sessions.delete(k)
  }
}

export function createSession(): Session {
  sweep()
  const id = uid()
  const now = Date.now()
  const session: Session = {
    id,
    createdAt: now,
    expiresAt: now + SESSION_TTL,
    hostId: '',
    members: [],
    rounds: [{ id: uid(), orders: {} }],
    currentRoundIndex: 0,
  }
  sessions.set(id, session)
  return session
}

export function findSession(id: string): Session | undefined {
  const s = sessions.get(id)
  if (!s) return undefined
  if (s.expiresAt < Date.now()) {
    sessions.delete(id)
    return undefined
  }
  return s
}

export function joinSession(
  sessionId: string,
  name: string,
): { memberId: string; isHost: boolean } | null {
  const session = findSession(sessionId)
  if (!session) return null
  const memberId = uid()
  const isHost = session.members.length === 0
  if (isHost) session.hostId = memberId
  session.members.push({ id: memberId, name })
  for (const round of session.rounds) {
    if (!round.orders[memberId]) {
      round.orders[memberId] = { items: [], confirmed: false }
    }
  }
  return { memberId, isHost }
}

export function updateOrder(
  sessionId: string,
  memberId: string,
  items: OrderItem[],
): Session | null {
  const session = findSession(sessionId)
  if (!session) return null
  const round = session.rounds[session.currentRoundIndex]!
  const prev = round.orders[memberId] ?? { items: [], confirmed: false }
  round.orders[memberId] = { ...prev, items }
  return session
}

export function confirmOrder(
  sessionId: string,
  memberId: string,
): { session: Session; allConfirmed: boolean } | null {
  const session = findSession(sessionId)
  if (!session) return null
  const round = session.rounds[session.currentRoundIndex]!
  if (!round.orders[memberId]) {
    round.orders[memberId] = { items: [], confirmed: false }
  }
  round.orders[memberId]!.confirmed = true
  const allConfirmed =
    session.members.length > 0 &&
    session.members.every((m) => round.orders[m.id]?.confirmed === true)
  return { session, allConfirmed }
}

export function unconfirmOrder(sessionId: string, memberId: string): Session | null {
  const session = findSession(sessionId)
  if (!session) return null
  const round = session.rounds[session.currentRoundIndex]!
  if (round.orders[memberId]) {
    round.orders[memberId]!.confirmed = false
  }
  return session
}

export function startNewRound(sessionId: string, memberId: string): Session | null {
  const session = findSession(sessionId)
  if (!session || session.hostId !== memberId) return null
  const round: Round = { id: uid(), orders: {} }
  for (const m of session.members) {
    round.orders[m.id] = { items: [], confirmed: false }
  }
  session.rounds.push(round)
  session.currentRoundIndex = session.rounds.length - 1
  return session
}
