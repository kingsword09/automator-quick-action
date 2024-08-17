import { spawn } from 'node:child_process'
import { glob } from 'glob'
import { defineExtension, extensionContext } from 'reactive-vscode'
import { Uri, commands } from 'vscode'

const { activate, deactivate } = defineExtension(() => {
  const disposable = commands.registerCommand('quick.open.in.default.program', async (dir) => {
    const selectDirPath = dir instanceof Uri ? dir.fsPath : ''
    let programName = 'Visual Studio Code'

    if ((await glob(['./*.gradle.kts', './*.gradle'], { cwd: selectDirPath })).length > 0) {
      programName = 'Android Studio'
    }
    else if ((await glob(['./*.xcodeproj', './*.xcworkspace'], { cwd: selectDirPath })).length > 0) {
      programName = 'Xcode'
    }

    spawn('bash', ['-c', `open -a "${programName}" "${selectDirPath}"`])
  })

  extensionContext.value?.subscriptions.push(disposable)
})

export { activate, deactivate }
