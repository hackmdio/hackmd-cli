# hackmd-cli - The HackMD/CodiMD Command Line Tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![License](https://img.shields.io/npm/l/@hackmd/hackmd-cli.svg)](https://github.com/hackmdio/hackmd-cli/blob/master/package.json)

* [Usage](#usage)
* [Commands](#commands)
* [Configuration](#configuration)
* [License](#license)

## Usage
<!-- usage -->
```sh-session
$ npm install -g @hackmd/hackmd-cli
$ hackmd-cli COMMAND
running command...
$ hackmd-cli (-v|--version|version)
@hackmd/hackmd-cli/1.2.0 darwin-x64 node-v12.21.0
$ hackmd-cli --help [COMMAND]
USAGE
  $ hackmd-cli COMMAND
...
```
<!-- usagestop -->

## Configuration

`hackmd-cli` operates on official HackMD instance(`hackmd.io`) by default. If you want to use cli with a self-hosted [CodiMD](https://github.com/hackmdio/codimd) or a [HackMD EE](https://hackmd.io/pricing) instance, you will need to configure `hackmd-cli` by either environment variable or JSON configuration.

### Example 1: Use with self-hosted CodiMD instance

Set environment variable in your shell profile:

```bash
export CMD_CLI_SERVER_URL=https://my.codimd-domain.dev
```

Or in JSON file (`~/.hackmd/config.json`):

```json
{
  "serverUrl": "https://my.codimd-domain.dev",
  "enterprise": false
}
```

### Example 2: Use with HackMD EE

Set environment variable in your shell profile:

```bash
export HMD_CLI_SERVER_URL=https://my.hackmd-ee.domain
```

Or in JSON file (`~/.hackmd/config.json`):

```json
{
  "serverUrl": "https://my.hackmd-ee.domain"
}
```

### Configuration Reference

All available configurations are listed in the table below.

|  Config key  |              Environment Variable              |  Data Type  |         Example Value          |                                                                                                                   Description                                                                                                                    |
| ------------ | :--------------------------------------------- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `serverUrl`  | `HMD_CLI_SERVER_URL` or `CMD_CLI_SERVER_URL`   | *`string`*  | `https://my.codimd-domain.dev` | The instance URL                                                                                                                                                                                                                                 |
| `cookiePath` | `HMD_CLI_COOKIE_PATH` or `CMD_CLI_COOKIE_PATH` | *`string`*  | `~/.hackmd/cookies.json`       | File for storing login cookie states                                                                                                                                                                                                             |
| `enterprise` | _n/a_                                          | *`boolean`* | `true`                         | Set whether the instance is enterise version expclitly. This config can only be set in JSON based config. When providing server url with environment variable, `enterprise` will be automatically set by checking the env prefix(`HMD` or `CMD`) |
| _n/a_        | `HMD_CLI_ID` or `CMD_CLI_ID`                   | *`string`*  | `me@codimd-domain.dev`         | Login username/email                                                                                                                                                                                                                             |
| _n/a_        | `HMD_CLI_PASSWORD` or `CMD_CLI_PASSWORD`       | *`string`*  | `dragon`                       | Login password                                                                                                                                                                                                                                   |

_Don't commit your login credentials!_

## Commands

<!-- commands -->
* [`hackmd-cli export [NOTEID] [OUTPUT]`](#hackmd-cli-export-noteid-output)
* [`hackmd-cli help [COMMAND]`](#hackmd-cli-help-command)
* [`hackmd-cli history`](#hackmd-cli-history)
* [`hackmd-cli import [FILE]`](#hackmd-cli-import-file)
* [`hackmd-cli list`](#hackmd-cli-list)
* [`hackmd-cli login`](#hackmd-cli-login)
* [`hackmd-cli logout`](#hackmd-cli-logout)
* [`hackmd-cli teams`](#hackmd-cli-teams)
* [`hackmd-cli whoami`](#hackmd-cli-whoami)

## `hackmd-cli export [NOTEID] [OUTPUT]`

Export note to local file or stdout(if the output_file param is omitted)

```
USAGE
  $ hackmd-cli export [NOTEID] [OUTPUT]

OPTIONS
  -h, --help  show CLI help
  --html
  --md
  --pdf

EXAMPLE
  $ hackmd-cli export [--pdf|--md|--html] <note_id> <output_file>
```

_See code: [src/commands/export.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/export.ts)_

## `hackmd-cli help [COMMAND]`

display help for hackmd-cli

```
USAGE
  $ hackmd-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `hackmd-cli history`

List history

```
USAGE
  $ hackmd-cli history

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
  $ hackmd-cli history

  ID                     Name
  A58r8ehYTlySO94oiC_MUA Note1
  EeNHDGocSTi70ytMMGQaaQ Note2
```

_See code: [src/commands/history.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/history.ts)_

## `hackmd-cli import [FILE]`

Create a note from markdown file

```
USAGE
  $ hackmd-cli import [FILE]

OPTIONS
  -h, --help       show CLI help
  -t, --team=team  team to use

EXAMPLE
  $ hackmd-cli import /path/to/markdown/file.md --team=xxx

  Your note is available at https://hackmd.io/note-url
```

_See code: [src/commands/import.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/import.ts)_

## `hackmd-cli list`

List notes

```
USAGE
  $ hackmd-cli list

OPTIONS
  -h, --help              show CLI help
  -t, --team=team         team name
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLE
  $ hackmd-cli list

  ID                     Name
  A58r8ehYTlySO94oiC_MUA Note1
  EeNHDGocSTi70ytMMGQaaQ Note2
```

_See code: [src/commands/list.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/list.ts)_

## `hackmd-cli login`

Login to HackMD/CodiMD server from CLI

```
USAGE
  $ hackmd-cli login

OPTIONS
  -h, --help   show CLI help
  -u, --id=id  Login email/username
  --ldap

EXAMPLE
  $ hackmd-cli login

  Enter your email: hello@hackmd.io
  Enter your password: *******

  Login as HMD successfully!
```

_See code: [src/commands/login.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/login.ts)_

## `hackmd-cli logout`

Logout from CLI

```
USAGE
  $ hackmd-cli logout

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ hackmd-cli logout

  You've logged out successfully
```

_See code: [src/commands/logout.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/logout.ts)_

## `hackmd-cli teams`

HackMD Teams Command

```
USAGE
  $ hackmd-cli teams

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
  $ hackmd-cli teams

  Path            Name
  team1           Team 1
  my-awesome-team My Awesome Team
```

_See code: [src/commands/teams.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/teams.ts)_

## `hackmd-cli whoami`

Show logged in account info

```
USAGE
  $ hackmd-cli whoami

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ hackmd-cli whoami

  You are logged in hackmd.io as {YOUR NAME} [user-id]
```

_See code: [src/commands/whoami.ts](https://github.com/hackmdio/hackmd-cli/blob/v1.2.0/src/commands/whoami.ts)_
<!-- commandsstop -->

## `hackmd-cli` piping mode

You can create a note by piping text stream to hackmd-cli

```
USAGE
  $ hackmd-cli [COMMAND]

EXAMPLE
  $ cat README.md | hackmd-cli

  Your note is available at https://hackmd.io/note-url
```

## License

MIT
