import { spawn } from 'node:child_process'
import { glob } from 'glob'
import { defineExtension, extensionContext } from 'reactive-vscode'
import { Uri, commands, workspace } from 'vscode'
import { recordToAsyncIterable } from './utils'

const { activate, deactivate } = defineExtension(() => {
  const disposable = commands.registerCommand('quick.open.in.default.program', async (dir) => {
    const selectDirPath = dir instanceof Uri ? dir.fsPath : ''
    let programName = 'Visual Studio Code'

    const programActions: Record<string, string> = workspace.getConfiguration('quick-action').get('programActions') ?? {}

    for await (const [key, value] of recordToAsyncIterable(programActions)) {
      if ((await glob(key.split(';'), { cwd: selectDirPath })).length > 0) {
        programName = value
        break
      }
    }

    spawn('bash', ['-c', `open -a "${programName}" "${selectDirPath}"`])
  })

  extensionContext.value?.subscriptions.push(disposable)
})

export { activate, deactivate }
