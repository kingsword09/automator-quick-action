import { useLogger } from 'reactive-vscode'
import { displayName } from './generated/meta'

export const logger = useLogger(displayName)

export async function* recordToAsyncIterable<T>(record: Record<string, T>): AsyncIterable<[string, T]> {
  for (const [key, value] of Object.entries(record)) {
    yield [key, value]
  }
}
