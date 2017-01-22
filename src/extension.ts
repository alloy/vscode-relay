import * as vscode from 'vscode'
import * as path from 'path'
import * as GraphQLConfigParser from 'graphql-config-parser'
import { GenerationResult, generateRelayFragmentsInterface, getConfig } from 'relay2ts'
import * as GraphQL from 'graphql'

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('relay2ts')

  function reportError(error: Error) {
    outputChannel.appendLine(error.message)
    outputChannel.appendLine(error.stack)
    vscode.window.showErrorMessage(error.message)
  }

  context.subscriptions.push(vscode.commands.registerCommand('extension.printPropsInterface', () => {
    getConfig({ rootPath: vscode.workspace.rootPath })
      .then(({ interfaceName, schema }) => {
        const source = vscode.window.activeTextEditor.document.getText()
        return generateRelayFragmentsInterface(schema, source, interfaceName)
      })
      .then(generationResult => {
        if (generationResult) {
          vscode.window.activeTextEditor.edit(editor => {
            if (generationResult.existingInterfaceRange) {
              const range = new vscode.Range(
                vscode.window.activeTextEditor.document.positionAt(generationResult.existingInterfaceRange.start),
                vscode.window.activeTextEditor.document.positionAt(generationResult.existingInterfaceRange.end),
              )
              editor.replace(range, generationResult.propsInterface)
            } else {
              const trailingNewLines = generationResult.input.match(/(\n*)$/)
              const numberOfNewLines = trailingNewLines && trailingNewLines[1].length
              const requiredNewLines = (numberOfNewLines && numberOfNewLines <= 2 && (2 - numberOfNewLines)) || 0
              let append = `${'\n'.repeat(requiredNewLines)}${generationResult.propsInterface}`
              const end = vscode.window.activeTextEditor.document.positionAt(generationResult.input.length)
              editor.insert(end, append)
            }
          })
        }
      })
      .catch(reportError)
  }))
}

export function deactivate() {
}
