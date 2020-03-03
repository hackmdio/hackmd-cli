codimd-cli - The CodiMD Command Line Tool
===

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@hackmd/codimd-cli.svg)](https://npmjs.org/package/@hackmd/codimd-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@hackmd/codimd-cli.svg)](https://npmjs.org/package/@hackmd/codimd-cli)
[![License](https://img.shields.io/npm/l/@hackmd/codimd-cli.svg)](https://github.com/hackmdio/codimd-cli/blob/master/package.json)

* [codimd-cli - The CodiMD Command Line Tool](#codimd-cli---the-codimd-command-line-tool)
* [Usage](#usage)
* [Commands](#commands)
* [Configuration](#configuration)
* [License](#license)

## Usage
<!-- usage -->
```sh-session
$ npm install -g @hackmd/codimd-cli
$ codimd-cli COMMAND
running command...
$ codimd-cli (-v|--version|version)
@hackmd/codimd-cli/1.0.3 linux-x64 node-v8.17.0
$ codimd-cli --help [COMMAND]
USAGE
  $ codimd-cli COMMAND
...
```
<!-- usagestop -->

## Configuration

`codimd-cli` support both JSON file config and environment variable config.

The config file is located at `~/.codimd/config.json`, it should be like this:

```json
{
  "serverUrl": "https://my.codimd-domain.dev"
}
```

Change the serverUrl value to your hosted CodiMD instance URL.

You can also speicify config as environment variable. For example, append this line to your `.bashrc`:

```bash
export CMD_CLI_SERVER_URL=https://my.codimd-domain.dev
```

All available configurations are listed in the table below.

| Config key   | Environment Variable  | Data Type  | Example Value                  | Description                          |
| ------------ |:--------------------- | ---------- | ------------------------------ | ------------------------------------ |
| `serverUrl`  | `CMD_CLI_SERVER_URL`  | *`string`* | `https://my.codimd-domain.dev` | The CodiMD instance URL              |
| `cookiePath` | `CMD_CLI_COOKIE_PATH` | *`string`* | `~/.codimd/cookies.json`       | File for storing login cookie states |

## Commands

<!-- commands -->
* [`codimd-cli export [NOTEID] [OUTPUT]`](#codimd-cli-export-noteid-output)
* [`codimd-cli help [COMMAND]`](#codimd-cli-help-command)
* [`codimd-cli history`](#codimd-cli-history)
* [`codimd-cli import [FILE]`](#codimd-cli-import-file)
* [`codimd-cli login`](#codimd-cli-login)
* [`codimd-cli logout`](#codimd-cli-logout)
* [`codimd-cli whoami`](#codimd-cli-whoami)

### `codimd-cli export [NOTEID] [OUTPUT]`

Export note to local file

```
USAGE
  $ codimd-cli export [NOTEID] [OUTPUT]

OPTIONS
  -h, --help  show CLI help
  --html
  --md
  --pdf

EXAMPLE
  $ codimd-cli export [--pdf|--md|--html] <note_id> <output_file>
```

_See code: [src/commands/export.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/export.ts)_

### `codimd-cli help [COMMAND]`

display help for codimd-cli

```
USAGE
  $ codimd-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

### `codimd-cli history`

List history

```
USAGE
  $ codimd-cli history

OPTIONS
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLE
  $ codimd-cli history

  ID                     Name
  A58r8ehYTlySO94oiC_MUA Note1
  EeNHDGocSTi70ytMMGQaaQ Note2
```

_See code: [src/commands/history.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/history.ts)_

### `codimd-cli import [FILE]`

Create a note from markdown file

```
USAGE
  $ codimd-cli import [FILE]

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ codimd-cli import /path/to/markdown/file.md

  Your note is available at https://codimd.domain/note-url
```

_See code: [src/commands/import.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/import.ts)_

### `codimd-cli login`

Login HackMD instance from CLI

```
USAGE
  $ codimd-cli login

OPTIONS
  -h, --help         show CLI help
  -u, --email=email  Login email

EXAMPLE
  $ codimd-cli login

  Enter your email: hello@codimd.domain
  Enter your password: *******

  Login as HMD successfully!
```

_See code: [src/commands/login.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/login.ts)_

### `codimd-cli logout`

Logout from CLI

```
USAGE
  $ codimd-cli logout

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ codimd-cli logout

  You've logged out successfully
```

_See code: [src/commands/logout.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/logout.ts)_

### `codimd-cli whoami`

Show logged in account info

```
USAGE
  $ codimd-cli whoami

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ codimd-cli whoami

  You are logged in codimd.domain as {YOUR NAME} [user-id]
```

_See code: [src/commands/whoami.ts](https://github.com/hackmdio/codimd-cli/blob/v1.0.3/src/commands/whoami.ts)_
<!-- commandsstop -->

### `codimd-cli` piping mode

You can create a note by piping text stream to codimd-cli

```
USAGE
  $ codimd-cli [COMMAND]

EXAMPLE
  $ cat README.md | codimd-cli

  Your note is available at https://codimd.domain/note-url
```

## License

MIT
