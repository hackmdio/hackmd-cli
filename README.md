# hackmd-cli - The HackMD Command Line Tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@hackmd/hackmd-cli.svg)](https://npmjs.org/package/@hackmd/hackmd-cli)
[![License](https://img.shields.io/npm/l/@hackmd/hackmd-cli.svg)](https://github.com/hackmdio/hackmd-cli/blob/master/package.json)

* [Usage](#usage)
* [Commands](#commands)
* [Configuration](#configuration)
* [License](#license)
* [Changelog](#changelog)

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
$ hackmd-cli (--version|-v)
@hackmd/hackmd-cli/2.5.0 darwin-arm64 node-v26.0.0
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
* [`hackmd-cli autocomplete [SHELL]`](#hackmd-cli-autocomplete-shell)
* [`hackmd-cli export`](#hackmd-cli-export)
* [`hackmd-cli folders`](#hackmd-cli-folders)
* [`hackmd-cli folders create`](#hackmd-cli-folders-create)
* [`hackmd-cli folders delete`](#hackmd-cli-folders-delete)
* [`hackmd-cli folders order`](#hackmd-cli-folders-order)
* [`hackmd-cli folders update`](#hackmd-cli-folders-update)
* [`hackmd-cli help [COMMANDS]`](#hackmd-cli-help-commands)
* [`hackmd-cli history`](#hackmd-cli-history)
* [`hackmd-cli login`](#hackmd-cli-login)
* [`hackmd-cli logout`](#hackmd-cli-logout)
* [`hackmd-cli notes`](#hackmd-cli-notes)
* [`hackmd-cli notes create`](#hackmd-cli-notes-create)
* [`hackmd-cli notes delete`](#hackmd-cli-notes-delete)
* [`hackmd-cli notes update`](#hackmd-cli-notes-update)
* [`hackmd-cli team-folders`](#hackmd-cli-team-folders)
* [`hackmd-cli team-folders create`](#hackmd-cli-team-folders-create)
* [`hackmd-cli team-folders delete`](#hackmd-cli-team-folders-delete)
* [`hackmd-cli team-folders order`](#hackmd-cli-team-folders-order)
* [`hackmd-cli team-folders update`](#hackmd-cli-team-folders-update)
* [`hackmd-cli team-notes`](#hackmd-cli-team-notes)
* [`hackmd-cli team-notes create`](#hackmd-cli-team-notes-create)
* [`hackmd-cli team-notes delete`](#hackmd-cli-team-notes-delete)
* [`hackmd-cli team-notes update`](#hackmd-cli-team-notes-update)
* [`hackmd-cli teams`](#hackmd-cli-teams)
* [`hackmd-cli version`](#hackmd-cli-version)
* [`hackmd-cli whoami`](#hackmd-cli-whoami)

## `hackmd-cli autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ hackmd-cli autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ hackmd-cli autocomplete

  $ hackmd-cli autocomplete bash

  $ hackmd-cli autocomplete fish

  $ hackmd-cli autocomplete zsh

  $ hackmd-cli autocomplete --refresh-cache
```

_See code: [@hackmd/oclif-plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.1.9-fish/src/commands/autocomplete/index.ts)_

## `hackmd-cli export`

Export note content

```
USAGE
  $ hackmd-cli export [-h] [--noteId <value>]

FLAGS
  -h, --help        Show CLI help.
  --noteId=<value>  HackMD note id

DESCRIPTION
  Export note content

EXAMPLES
  $ hackmd-cli export --noteId=kNFWV5E-Qz-QP7u6XnNvyQ
  # A note to be exported
```

_See code: [src/commands/export.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/export.ts)_

## `hackmd-cli folders`

HackMD folders commands

```
USAGE
  $ hackmd-cli folders [--folderId <value>] [-h] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help          Show CLI help.
  -x, --extended      show extra columns
  --columns=<value>   only show provided columns (comma-separated)
  --csv               output is csv format [alias: --output=csv]
  --filter=<value>    filter property by partial string matching, ex: name=foo
  --folderId=<value>  HackMD folder id
  --no-header         hide table header from output
  --no-truncate       do not truncate output to fit screen
  --output=<option>   output in a more machine friendly format
                      <options: csv|json|yaml>
  --sort=<value>      property to sort by (prepend '-' for descending)

DESCRIPTION
  HackMD folders commands

EXAMPLES
  $ hackmd-cli folders
  ID                                   Color   Description           Icon  Name        Parent Folder ID
  ──────────────────────────────────── ─────── ───────────────────── ───── ─────────── ────────────────────────────────────
  91722050-bf47-4334-9e5d-87125a724c29 #4F46E5 Project documentation 1F600 engineering fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c
```

_See code: [src/commands/folders/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/folders/index.ts)_

## `hackmd-cli folders create`

Create a folder

```
USAGE
  $ hackmd-cli folders create [--color <value>] [--description <value>] [-h] [--icon <value>] [--name <value>]
    [--parentFolderId <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  |
    [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help                Show CLI help.
  -x, --extended            show extra columns
  --color=<value>           folder color
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --description=<value>     folder description
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --icon=<value>            folder icon
  --name=<value>            folder name
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --parentFolderId=<value>  parent folder id
  --sort=<value>            property to sort by (prepend '-' for descending)

DESCRIPTION
  Create a folder

EXAMPLES
  $ hackmd-cli folders create --name='docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5
  ID                                   Name Parent Folder ID                     Color   Description Icon
  ──────────────────────────────────── ──── ──────────────────────────────────── ─────── ─────────── ─────
  a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c #4F46E5 Docs        1F600
```

## `hackmd-cli folders delete`

Delete a folder

```
USAGE
  $ hackmd-cli folders delete [--folderId <value>] [-h]

FLAGS
  -h, --help          Show CLI help.
  --folderId=<value>  HackMD folder id

DESCRIPTION
  Delete a folder

EXAMPLES
  $ hackmd-cli folders delete --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
```

## `hackmd-cli folders order`

Get or update folder order

```
USAGE
  $ hackmd-cli folders order [-h] [--order <value>]

FLAGS
  -h, --help       Show CLI help.
  --order=<value>  folder order JSON, e.g. {"root":["folder-id"]}

DESCRIPTION
  Get or update folder order

EXAMPLES
  $ hackmd-cli folders order

  $ hackmd-cli folders order --order='{"root":["91722050-bf47-4334-9e5d-87125a724c29","fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c"]}'
```

## `hackmd-cli folders update`

Update folder

```
USAGE
  $ hackmd-cli folders update [--color <value>] [--description <value>] [--folderId <value>] [-h] [--icon <value>]
    [--name <value>] [--parentFolderId <value>]

FLAGS
  -h, --help                Show CLI help.
  --color=<value>           folder color
  --description=<value>     folder description
  --folderId=<value>        HackMD folder id
  --icon=<value>            folder icon
  --name=<value>            folder name
  --parentFolderId=<value>  parent folder id

DESCRIPTION
  Update folder

EXAMPLES
  $ hackmd-cli folders update --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --name='docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5
```

## `hackmd-cli help [COMMANDS]`

Display help for hackmd-cli.

```
USAGE
  $ hackmd-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for hackmd-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `hackmd-cli history`

List user browse history

```
USAGE
  $ hackmd-cli history [-h] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List user browse history

EXAMPLES
  $ hackmd-cli history
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
  BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null                   CLI-test
```

_See code: [src/commands/history.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/history.ts)_

## `hackmd-cli login`

Login to HackMD server from CLI

```
USAGE
  $ hackmd-cli login [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Login to HackMD server from CLI

EXAMPLES
  $ hackmd-cli login
  Enter your access token: MY_ACCESS_TOKEN
  Login successfully
```

_See code: [src/commands/login.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/login.ts)_

## `hackmd-cli logout`

Login to HackMD server from CLI

```
USAGE
  $ hackmd-cli logout [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Login to HackMD server from CLI

EXAMPLES
  $ hackmd-cli logout
  You've logged out successfully
```

_See code: [src/commands/logout.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/logout.ts)_

## `hackmd-cli notes`

HackMD notes commands

```
USAGE
  $ hackmd-cli notes [-h] [--noteId <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --noteId=<value>   HackMD note id
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  HackMD notes commands

EXAMPLES
  $ hackmd-cli notes
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA CLI test note                    gvfz2UB5THiKABQJQnLs6Q null
```

_See code: [src/commands/notes/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/notes/index.ts)_

## `hackmd-cli notes create`

Create a note

```
USAGE
  $ hackmd-cli notes create [--commentPermission <value>] [--content <value>] [-e] [-h] [--parentFolderId <value>]
    [--readPermission <value>] [--tags <value>] [--title <value>] [--writePermission <value>] [--columns <value> | -x]
    [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -e, --editor                 create note with $EDITOR
  -h, --help                   Show CLI help.
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --commentPermission=<value>  set comment permission: disabled, forbidden, owners, signed_in_users, everyone
  --content=<value>            new note content
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --parentFolderId=<value>     parent folder id
  --readPermission=<value>     set note permission: owner, signed_in, guest
  --sort=<value>               property to sort by (prepend '-' for descending)
  --tags=<value>               set note tags, comma-separated (e.g. tag1,tag2)
  --title=<value>              new note title
  --writePermission=<value>    set note permission: owner, signed_in, guest

DESCRIPTION
  Create a note

EXAMPLES
  $ hackmd-cli notes create --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     

  $ hackmd-cli notes create --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
  ID                     Title                            User Path               Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     

  Or you can pipe content via Unix pipeline:

  cat README.md | hackmd-cli notes create
```

## `hackmd-cli notes delete`

Delete a note

```
USAGE
  $ hackmd-cli notes delete [-h] [--noteId <value>]

FLAGS
  -h, --help        Show CLI help.
  --noteId=<value>  HackMD note id

DESCRIPTION
  Delete a note

EXAMPLES
  $ hackmd-cli notes delete --noteId=WNkLM6gkS0Cg2cQ8rv7bYA
```

## `hackmd-cli notes update`

Update note

```
USAGE
  $ hackmd-cli notes update [--content <value>] [-h] [--noteId <value>] [--parentFolderId <value>] [--permalink <value>]
    [--readPermission <value>] [--tags <value>] [--writePermission <value>]

FLAGS
  -h, --help                    Show CLI help.
  --content=<value>             new note content
  --noteId=<value>              HackMD note id
  --parentFolderId=<value>      parent folder id
  --permalink=<value>           note permalink
  --readPermission=<value>      set note permission: owner, signed_in, guest
  --tags=<value>                set note tags, comma-separated (e.g. tag1,tag2)
  --writePermission=<value>     set note permission: owner, signed_in, guest

DESCRIPTION
  Update note

EXAMPLES
  $ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'

  $ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new title'

  $ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner

  $ hackmd-cli notes update --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --tags=tag1,tag2
```

## `hackmd-cli team-folders`

HackMD team folders commands

```
USAGE
  $ hackmd-cli team-folders [--folderId <value>] [-h] [--teamPath <value>] [--columns <value> | -x] [--sort
    <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help          Show CLI help.
  -x, --extended      show extra columns
  --columns=<value>   only show provided columns (comma-separated)
  --csv               output is csv format [alias: --output=csv]
  --filter=<value>    filter property by partial string matching, ex: name=foo
  --folderId=<value>  HackMD folder id
  --no-header         hide table header from output
  --no-truncate       do not truncate output to fit screen
  --output=<option>   output in a more machine friendly format
                      <options: csv|json|yaml>
  --sort=<value>      property to sort by (prepend '-' for descending)
  --teamPath=<value>  HackMD team path

DESCRIPTION
  HackMD team folders commands

EXAMPLES
  $ hackmd-cli team-folders --teamPath engineering
  ID                                   Color   Description     Icon  Name       Parent Folder ID
  ──────────────────────────────────── ─────── ─────────────── ───── ────────── ────────────────────────────────────
  91722050-bf47-4334-9e5d-87125a724c29 #4F46E5 Team handbook    1F600 team-docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c
```

_See code: [src/commands/team-folders/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/team-folders/index.ts)_

## `hackmd-cli team-folders create`

Create a team folder

```
USAGE
  $ hackmd-cli team-folders create [--color <value>] [--description <value>] [-h] [--icon <value>] [--name <value>]
    [--parentFolderId <value>] [--teamPath <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help                Show CLI help.
  -x, --extended            show extra columns
  --color=<value>           folder color
  --columns=<value>         only show provided columns (comma-separated)
  --csv                     output is csv format [alias: --output=csv]
  --description=<value>     folder description
  --filter=<value>          filter property by partial string matching, ex: name=foo
  --icon=<value>            folder icon
  --name=<value>            folder name
  --no-header               hide table header from output
  --no-truncate             do not truncate output to fit screen
  --output=<option>         output in a more machine friendly format
                            <options: csv|json|yaml>
  --parentFolderId=<value>  parent folder id
  --sort=<value>            property to sort by (prepend '-' for descending)
  --teamPath=<value>        HackMD team path

DESCRIPTION
  Create a team folder

EXAMPLES
  $ hackmd-cli team-folders create --teamPath=CLI-test --name='team-docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5
  ID                                   Name      Parent Folder ID                     Color   Description Icon
  ──────────────────────────────────── ───────── ──────────────────────────────────── ─────── ─────────── ─────
  a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d team-docs fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c #4F46E5 Docs        1F600
```

## `hackmd-cli team-folders delete`

Delete a team folder

```
USAGE
  $ hackmd-cli team-folders delete [--folderId <value>] [-h] [--teamPath <value>]

FLAGS
  -h, --help          Show CLI help.
  --folderId=<value>  HackMD folder id
  --teamPath=<value>  HackMD team path

DESCRIPTION
  Delete a team folder

EXAMPLES
  $ hackmd-cli team-folders delete --teamPath=CLI-test --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d
```

## `hackmd-cli team-folders order`

Get or update team folder order

```
USAGE
  $ hackmd-cli team-folders order [-h] [--order <value>] [--teamPath <value>]

FLAGS
  -h, --help          Show CLI help.
  --order=<value>     folder order JSON, e.g. {"root":["folder-id"]}
  --teamPath=<value>  HackMD team path

DESCRIPTION
  Get or update team folder order

EXAMPLES
  $ hackmd-cli team-folders order --teamPath=CLI-test

  $ hackmd-cli team-folders order --teamPath=CLI-test --order='{"root":["91722050-bf47-4334-9e5d-87125a724c29","fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c"]}'
```

## `hackmd-cli team-folders update`

Update team folder

```
USAGE
  $ hackmd-cli team-folders update [--color <value>] [--description <value>] [--folderId <value>] [-h] [--icon <value>]
    [--name <value>] [--parentFolderId <value>] [--teamPath <value>]

FLAGS
  -h, --help                Show CLI help.
  --color=<value>           folder color
  --description=<value>     folder description
  --folderId=<value>        HackMD folder id
  --icon=<value>            folder icon
  --name=<value>            folder name
  --parentFolderId=<value>  parent folder id
  --teamPath=<value>        HackMD team path

DESCRIPTION
  Update team folder

EXAMPLES
  $ hackmd-cli team-folders update --teamPath=CLI-test --folderId=a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d --name='team-docs' --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --description='Docs' --icon=1F600 --color=#4F46E5
```

## `hackmd-cli team-notes`

HackMD team-notes commands

```
USAGE
  $ hackmd-cli team-notes [-h] [--teamPath <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help          Show CLI help.
  -x, --extended      show extra columns
  --columns=<value>   only show provided columns (comma-separated)
  --csv               output is csv format [alias: --output=csv]
  --filter=<value>    filter property by partial string matching, ex: name=foo
  --no-header         hide table header from output
  --no-truncate       do not truncate output to fit screen
  --output=<option>   output in a more machine friendly format
                      <options: csv|json|yaml>
  --sort=<value>      property to sort by (prepend '-' for descending)
  --teamPath=<value>  HackMD team path

DESCRIPTION
  HackMD team-notes commands

EXAMPLES
  $ hackmd-cli team-notes --teamPath=CLI-test
  ID                     Title                            User path Team path
  ────────────────────── ──────────────────────────────── ──────── ────────
  WNkLM6gkS0Cg2cQ8rv7bYA a team note                      null     CLI-test
  BnC6gN0_TfStV2KKmPPXeg Welcome to your team's workspace null     CLI-test
```

_See code: [src/commands/team-notes/index.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/team-notes/index.ts)_

## `hackmd-cli team-notes create`

Create a team note

```
USAGE
  $ hackmd-cli team-notes create [--commentPermission <value>] [--content <value>] [-e] [-h] [--parentFolderId <value>]
    [--readPermission <value>] [--tags <value>] [--teamPath <value>] [--title <value>] [--writePermission <value>]
    [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]]
    [--no-header | ]

FLAGS
  -e, --editor                 create note with $EDITOR
  -h, --help                   Show CLI help.
  -x, --extended               show extra columns
  --columns=<value>            only show provided columns (comma-separated)
  --commentPermission=<value>  set comment permission: disabled, forbidden, owners, signed_in_users, everyone
  --content=<value>            new note content
  --csv                        output is csv format [alias: --output=csv]
  --filter=<value>             filter property by partial string matching, ex: name=foo
  --no-header                  hide table header from output
  --no-truncate                do not truncate output to fit screen
  --output=<option>            output in a more machine friendly format
                               <options: csv|json|yaml>
  --parentFolderId=<value>     parent folder id
  --readPermission=<value>     set note permission: owner, signed_in, guest
  --sort=<value>               property to sort by (prepend '-' for descending)
  --tags=<value>               set note tags, comma-separated (e.g. tag1,tag2)
  --teamPath=<value>           HackMD team path
  --title=<value>              new note title
  --writePermission=<value>    set note permission: owner, signed_in, guest

DESCRIPTION
  Create a team note

EXAMPLES
  $ hackmd-cli team-notes create --teamPath=CLI-test --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
  ID                     Title                            User Path              Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     

  $ hackmd-cli team-notes create --teamPath=CLI-test --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new note' --readPermission=owner --writePermission=owner --commentPermission=disabled
  ID                     Title                            User Path              Team Path
  ────────────────────── ──────────────────────────────── ────────────────────── ────────
  raUuSTetT5uQbqQfLnz9lA A new note                       gvfz2UB5THiKABQJQnLs6Q null     

  Or you can pipe content via Unix pipeline:

  cat README.md | hackmd-cli team-notes create --teamPath=CLI-test
```

## `hackmd-cli team-notes delete`

Delete a team note

```
USAGE
  $ hackmd-cli team-notes delete [-h] [--noteId <value>] [--teamPath <value>]

FLAGS
  -h, --help          Show CLI help.
  --noteId=<value>    HackMD note id
  --teamPath=<value>  HackMD team path

DESCRIPTION
  Delete a team note

EXAMPLES
  $ hackmd-cli team-notes delete --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA
```

## `hackmd-cli team-notes update`

Update team note

```
USAGE
  $ hackmd-cli team-notes update [--content <value>] [-h] [--noteId <value>] [--parentFolderId <value>]
    [--permalink <value>] [--readPermission <value>] [--tags <value>] [--teamPath <value>] [--writePermission <value>]

FLAGS
  -h, --help                    Show CLI help.
  --content=<value>             new note content
  --noteId=<value>              HackMD note id
  --parentFolderId=<value>      parent folder id
  --permalink=<value>           note permalink
  --readPermission=<value>      set note permission: owner, signed_in, guest
  --tags=<value>                set note tags, comma-separated (e.g. tag1,tag2)
  --teamPath=<value>            HackMD team path
  --writePermission=<value>     set note permission: owner, signed_in, guest

DESCRIPTION
  Update team note

EXAMPLES
  $ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --content='# A new title'

  $ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --parentFolderId=fc7a3d48-4a07-4cbf-bf4f-e65dd896e01c --content='# A new title'

  $ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --readPermission=owner --writePermission=owner

  $ hackmd-cli team-notes update --teamPath=CLI-test --noteId=WNkLM6gkS0Cg2cQ8rv7bYA --tags=tag1,tag2
```

## `hackmd-cli teams`

List teams

```
USAGE
  $ hackmd-cli teams [-h] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  List teams

EXAMPLES
  $ hackmd-cli teams
  ID                                   Name          Path     Owner ID
  ──────────────────────────────────── ───────────── ──────── ────────────────────────────────────
  f76308a6-d77a-41f6-86d0-8ada426a6fb4 CLI test team CLI-test 82f7f3d9-4079-4c78-8a00-14094272ece9
```

_See code: [src/commands/teams.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/teams.ts)_

## `hackmd-cli version`

```
USAGE
  $ hackmd-cli version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.3.3/src/commands/version.ts)_

## `hackmd-cli whoami`

Show current user information

```
USAGE
  $ hackmd-cli whoami [-h] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  Show current user information

EXAMPLES
  $ hackmd-cli whoami
  ID                                   Name           Email User path
  ──────────────────────────────────── ────────────── ───── ──────────────────────
  82f7f3d9-4079-4c78-8a00-14094272ece9 Ming-Hsiu Tsai null  gvfz2UB5THiKABQJQnLs6Q
```

_See code: [src/commands/whoami.ts](https://github.com/hackmdio/hackmd-cli/blob/v2.5.0/src/commands/whoami.ts)_
<!-- commandsstop -->

## License

MIT

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.
