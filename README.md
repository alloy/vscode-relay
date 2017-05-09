![vscode-relay](https://cloud.githubusercontent.com/assets/2320/22180326/ff856ada-e03a-11e6-9975-e688b2aa17fb.gif)

# vscode-relay README

For setup, see [relay2ts](https://github.com/alloy/relay2ts)

## Features

* Takes a Relay component, and converts its Relay fragment into an interface for your Component's props.

## Installation

As this isn't in the extensions section of VS Code:

```sh
git clone https://github.com/alloy/vscode-relay.git
cd vscode-relay
yarn install
yarn global add vsce
vsce package 
code --install-extension vscode-relay-0.0.1.vsix
```

