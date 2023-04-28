# hackmd-cli - The HackMD Command Line Tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![License](https://img.shields.io/npm/l/@hackmd/hackmd-cli.svg)](https://github.com/hackmdio/hackmd-cli/blob/master/package.json)

* [Usage](#usage)
* [Commands](#commands)
* [Configuration](#configuration)
* [License](#license)

## v2 notice

`hackmd-cli` v2 now only supports the official HackMD instance([hackmd.io](https://hackmd.io)) and HackMD EE instances after version `1.38.1`. CodiMD is not supported anymore. If you want to use the CLI tools with CodiMD, please check out the [`v1.x` README](https://github.com/hackmdio/hackmd-cli/tree/v1.2.0) and follow the instruction there.

### Migrating from v1.x

1. If you are using the CLI with CodiMD, please follow the [`v1.x` README](https://github.com/hackmdio/hackmd-cli/tree/v1.2.0)
2. If you are using the CLI with HackMD([hackmd.io](https://hackmd.io)) or HackMD EE(Enterprise Edition) instances:
    * **You're using the JSON file-based config**: Remove `~/.hackmd/config.json` and start over again. You can start with [configuration](#configuration) section.
    * **You're using environment variable based config**: `HMD_CLI_SERVER_URL` has been replaced with `HMD_API_ENDPOINT_URL`. And `HMD_API_ENDPOINT_URL` may vary depending on your instance. Please check contact your instance admin to get the correct `HMD_API_ENDPOINT_URL`. For generating access token, please check the [configuration](#configuration) section. You'll need to set the `HMD_API_ACCESS_TOKEN` environment variable.

## Usage
<!-- usage -->
```sh-session
$ npm install -g @hackmd/hackmd-cli
$ hackmd-cli COMMAND
running command...
$ hackmd-cli (-v|--version|version)
@hackmd/hackmd-cli/2.1.0 darwin-arm64 node-v17.9.1
$ hackmd-cli --help [COMMAND]
USAGE
  $ hackmd-cli COMMAND
...
```
<!-- usagestop -->

## Configuration

### Set access token

Access token should be set before using `hackmd-cli`. It can be created by landing [hackmd.io](https://hackmd.io) -> [Setting](https://hackmd.io/settings#api) -> [API](https://hackmd.io/settings#api) -> Create API token. Copy the token and set it as config variable. For more details, please follow the tutorial: [How to issue an API token](https://hackmd.io/@hackmd-api/developer-portal/https%3A%2F%2Fhackmd.io%2F%40hackmd-api%2Fhow-to-issue-an-api-token).

#### Example:

Set the access token by `login` command. By doing so, the access token will be saved in `~/.hackmd/config.json`.

```sh-session
$ hackmd-cli login
Enter your access token: My_ACCESS_TOKEN
```

Or you don't want to keep the credentials in one file, you can set it through environment variable:

```bash
export HMD_API_ACCESS_TOKEN=MY_ACCESS_TOKEN
```

Or you can write the configuration file manually. Edit `~/.hackmd/config.json` with the following content:

```json
{
  "accessToken": "MY_ACCESS_TOKEN"
}
```

### Specify HackMD API endpoint manually (optional)

`hackmd-cli` operates on the official HackMD API endpoint (`https://api.hackmd.io/v1`) by default. If you want to use `hackmd-cli` with a custom [HackMD EE](https://hackmd.io/enterprise) instance, you will need to configure the API endpoint by either environment variable or JSON configuration manually.

#### Example:

Set environment variable in your shell profile:

```bash
export HMD_API_ENDPOINT_URL=https://my.hackmd-ee.api.endpoint
```

Or in JSON file (`~/.hackmd/config.json`):

```json
{
  "hackmdAPIEndpointURL": "https://my.hackmd-ee.api.endpoint"
}
```

### Configuration Reference

All available configurations are listed in the table below.

|       Config key       |  Environment Variable  | Data Type  |              Example Value              |         Description         |
| ---------------------- | :--------------------- | ---------- | --------------------------------------- | --------------------------- |
| `hackmdAPIEndpointURL` | `HMD_API_ENDPOINT_URL` | *`string`* | `https://api.hackmd.io/v1`              | HackMD EE API endpoint URL  |
| `accessToken`          | `HMD_API_ACCESS_TOKEN` | *`string`* | `UFHR12H7FSEF3ADFY3N9YNRN2E49VGR212NBF` | Token to access HackMD APIs |

## Commands

<!-- commands -->
* [`hackmd-cli export`](#hackmd-cli-export)
* [`hackmd-cli help [COMMAND]`](#hackmd-cli-help-command)
* [`hackmd-cli history`](#hackmd-cli-history)
* [`hackmd-cli login`](#hackmd-cli-login)
* [`hackmd-cli logout`](#hackmd-cli-logout)
* [`hackmd-cli notes`](#hackmd-cli-notes)
* [`hackmd-cli notes:create`](#hackmd-cli-notescreate)
* [`hackmd-cli notes:delete`](#hackmd-cli-notesdelete)
* [`hackmd-cli notes:update`](#hackmd-cli-notesupdate)
* [`hackmd-cli team-notes`](#hackmd-cli-team-notes)
* [`hackmd-cli team-notes:create`](#hackmd-cli-team-notescreate)
* [`hackmd-cli team-notes:delete`](#hackmd-cli-team-notesdelete)
* [`hackmd-cli team-notes:update`](#hackmd-cli-team-notesupdate)
* [`hackmd-cli teams`](#hackmd-cli-teams)
* [`hackmd-cli version`](#hackmd-cli-version)
* [`hackmd-cli whoami`](#hackmd-cli-whoami)

## `hackmd-cli export`

Export note content

```
USAGE
  $ hackmd-cli export

OPTIONS
  -h, --help       Show CLI help.
  --noteId=noteId  HackMD note id

EXAMPLE
  $ hackmd-cli export --noteId=kNFWV5E-Qz-QP7u6XnNvyQ
  # A note to be exported
```

_See code: [src/commands/export.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/export.ts)_

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

List user browse history

```
USAGE
  $ hackmd-cli history

OPTIONS
  -h, --help              Show CLI help.
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
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
  BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null                   CLI-test
```

_See code: [src/commands/history.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/history.ts)_

## `hackmd-cli login`

Login to HackMD server from CLI

```
USAGE
  $ hackmd-cli login

OPTIONS
  -h, --help  Show CLI help.

EXAMPLE
  $ hackmd-cli login

  Enter your access token: MY_ACCESS_TOKEN

  Login successfully
```

_See code: [src/commands/login.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/login.ts)_

## `hackmd-cli logout`

Login to HackMD server from CLI

```
USAGE
  $ hackmd-cli logout

OPTIONS
  -h, --help  Show CLI help.

EXAMPLE
  $ hackmd-cli logout

  You've logged out successfully
```

_See code: [src/commands/logout.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/logout.ts)_

## `hackmd-cli notes`

HackMD notes commands

```
USAGE
  $ hackmd-cli notes

OPTIONS
  -h, --help              Show CLI help.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --noteId=noteId         HackMD note id
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLE
  $ hackmd-cli notes
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
```

_See code: [src/commands/notes/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/notes/index.ts)_

## `hackmd-cli notes:create`

Create a note

```
USAGE
  $ hackmd-cli notes:create

OPTIONS
  -e, --editor                           create note with $EDITOR
  -h, --help                             Show CLI help.
  -x, --extended                         show extra columns
  --columns=columns                      only show provided columns (comma-separated)
  --commentPermission=commentPermission  set comment permission: disabled, forbidden, owners, signed_in_users, everyone
  --content=content                      new note content
  --csv                                  output is csv format [alias: --output=csv]
  --filter=filter                        filter property by partial string matching, ex: name=foo
  --no-header                            hide table header from output
  --no-truncate                          do not truncate output to fit screen
  --output=csv|json|yaml                 output in a more machine friendly format
  --readPermission=readPermission        set note permission: owner, signed_in, guest
  --sort=sort                            property to sort by (prepend '-' for descending)
  --title=title                          new note title
  --writePermission=writePermission      set note permission: owner, signed_in, guest

EXAMPLES
  notes create --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ──────────────────────  ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q  null
  Or you can pipe content via Unix pipeline:
  cat README.md | hackmd-cli notes create
```

_See code: [src/commands/notes/create.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/notes/create.ts)_

## `hackmd-cli notes:delete`

Delete a note

```
USAGE
  $ hackmd-cli notes:delete

OPTIONS
  -h, --help       Show CLI help.
  --noteId=noteId  HackMD note id

EXAMPLE
  $ hackmd-cli notes delete --noteId=WNkLM6gkS0Cg2cQ8rv7bYA
```

_See code: [src/commands/notes/delete.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/notes/delete.ts)_

## `hackmd-cli notes:update`

Update note content

```
USAGE
  $ hackmd-cli notes:update

OPTIONS
  -h, --help         Show CLI help.
  --content=content  new note content
  --noteId=noteId    HackMD note id

EXAMPLE
  $ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'
```

_See code: [src/commands/notes/update.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/notes/update.ts)_

## `hackmd-cli team-notes`

HackMD team-notes commands

```
USAGE
  $ hackmd-cli team-notes

OPTIONS
  -h, --help              Show CLI help.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
  --teamPath=teamPath     HackMD team path

EXAMPLE
  $ hackmd-cli team-notes --teamPath=CLI-test
  ID                     Title                            User path Team path
  ────────────────────── ──────────────────────────────── ──────── ────────
  WNkLM6gkS0Cg2cQ8rv7bYA a team note                      null     CLI-test
  BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null     CLI-test
```

_See code: [src/commands/team-notes/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/team-notes/index.ts)_

## `hackmd-cli team-notes:create`

Create a team note

```
USAGE
  $ hackmd-cli team-notes:create

OPTIONS
  -h, --help                             Show CLI help.
  -x, --extended                         show extra columns
  --columns=columns                      only show provided columns (comma-separated)
  --commentPermission=commentPermission  set comment permission: disabled, forbidden, owners, signed_in_users, everyone
  --content=content                      new note content
  --csv                                  output is csv format [alias: --output=csv]
  --filter=filter                        filter property by partial string matching, ex: name=foo
  --no-header                            hide table header from output
  --no-truncate                          do not truncate output to fit screen
  --output=csv|json|yaml                 output in a more machine friendly format
  --readPermission=readPermission        set note permission: owner, signed_in, guest
  --sort=sort                            property to sort by (prepend '-' for descending)
  --teamPath=teamPath                    HackMD team path
  --title=title                          new note title
  --writePermission=writePermission      set note permission: owner, signed_in, guest

EXAMPLES
  team-notes:create --teamPath=CLI-test --content='# A new note' --readPermission=owner --writePermission=owner 
  --commentPermission=disabled
  ID                     Title                            User Path              Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     
  Or you can pipe content via Unix pipeline:
  cat README.md | hackmd-cli notes create --teamPath=CLI-test
```

_See code: [src/commands/team-notes/create.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/team-notes/create.ts)_

## `hackmd-cli team-notes:delete`

Delete a team note

```
USAGE
  $ hackmd-cli team-notes:delete

OPTIONS
  -h, --help           Show CLI help.
  --noteId=noteId      HackMD note id
  --teamPath=teamPath  HackMD team path

EXAMPLE
  $ hackmd-cli team-notes delete --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA
```

_See code: [src/commands/team-notes/delete.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/team-notes/delete.ts)_

## `hackmd-cli team-notes:update`

Update team note content

```
USAGE
  $ hackmd-cli team-notes:update

OPTIONS
  -h, --help           Show CLI help.
  --content=content    new note content
  --noteId=noteId      HackMD note id
  --teamPath=teamPath  HackMD team path

EXAMPLE
  $ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'
```

_See code: [src/commands/team-notes/update.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/team-notes/update.ts)_

## `hackmd-cli teams`

List teams

```
USAGE
  $ hackmd-cli teams

OPTIONS
  -h, --help              Show CLI help.
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
  ID                                   Name          Path     Owner ID
  ──────────────────────────────────── ───────────── ──────── ────────────────────────────────────
  f76308a6-d77a-41f6-86d0-8ada426a6fb4 CLI test team CLI-test 82f7f3d9-4079-4c78-8a00-14094272ece9
```

_See code: [src/commands/teams.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/teams.ts)_

## `hackmd-cli version`

```
USAGE
  $ hackmd-cli version
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.0.4/src/commands/version.ts)_

## `hackmd-cli whoami`

Show current user information

```
USAGE
  $ hackmd-cli whoami

OPTIONS
  -h, --help              Show CLI help.
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLE
  $ hackmd-cli whoami
  ID                                   Name           Email User path
  ──────────────────────────────────── ────────────── ───── ──────────────────────
  82f7f3d9-4079-4c78-8a00-14094272ece9 Ming-Hsiu Tsai null  gvfz2UB5THiKABQJQnLs6Q
```

_See code: [src/commands/whoami.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.1.0/src/commands/whoami.ts)_
<!-- commandsstop -->

## License

MIT
