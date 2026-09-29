---
name: hackmd-cli
description: HackMD command-line interface for managing notes, folders, and other v1 API operations. Use for HackMD content, team workflows, exports, or API automation.
---

# HackMD CLI

Command-line tool for managing HackMD notes, team notes, personal folders, and team folders via the HackMD API.

## Setup

### Install

```bash
npm install -g @hackmd/hackmd-cli
```

### Configure Access Token

Create an API token at [hackmd.io/settings#api](https://hackmd.io/settings#api), then configure:

```bash
# Interactive login (saves to ~/.hackmd/config.json)
hackmd-cli login

# Or via environment variable
export HMD_API_ACCESS_TOKEN=YOUR_TOKEN
```

For HackMD EE instances, also set the API endpoint:

```bash
export HMD_API_ENDPOINT_URL=https://your.hackmd-ee.endpoint
```

## Commands

### Other API operations

Prefer the focused `notes`, `folders`, and other commands when available. For other operations, find the operation ID and parameters, then call it:

```bash
hackmd-cli api operations
hackmd-cli api describe GetTeamNote
hackmd-cli api call GetTeamNote --path teampath=docs --path noteId=abc
hackmd-cli api call CreateNote --body @note.json
hackmd-cli api call UploadNoteImage --path noteId=abc --file image=@photo.png
```

Repeat `--path key=value`, `--query key=value`, or `--header 'Name: value'` as needed. `--body` accepts JSON text, `@file`, or `-` for stdin. `--file image=@path` is for multipart upload; use `--mime` if the extension is unknown. `--include` shows HTTP status and headers. The list comes from the API client bundled with the CLI; older EE servers may not support every operation. Generic writes are not retried automatically. Do not run writes or deletes without the user's authorization.

### Authentication

```bash
hackmd-cli login              # Set access token interactively
hackmd-cli logout             # Clear stored credentials
hackmd-cli whoami             # Show current user info
```

### Personal Notes

```bash
# List all notes
hackmd-cli notes

# Get specific note
hackmd-cli notes --noteId=<id>

# Create note
hackmd-cli notes create --content='# Title' --title='My Note' --description='Summary'
hackmd-cli notes create --readPermission=owner --writePermission=owner

# Create note inside a folder
hackmd-cli notes create --parentFolderId=<folder-id> --content='# Title'

# Create from file/stdin
cat README.md | hackmd-cli notes create

# Create with editor
hackmd-cli notes create -e

# Update note
hackmd-cli notes update --noteId=<id> --content='# New Content'
hackmd-cli notes update --noteId=<id> --title='New title'
hackmd-cli notes update --noteId=<id> --description='New summary'
hackmd-cli notes update --noteId=<id> --clear=description

# Move note into a folder
hackmd-cli notes update --noteId=<id> --parentFolderId=<folder-id>
hackmd-cli notes update --noteId=<id> --root

# Delete note
hackmd-cli notes delete --noteId=<id>
```

### Team Notes

```bash
# List team notes
hackmd-cli team-notes --teamPath=<team-path>

# Get a specific team note
hackmd-cli team-notes --teamPath=<team-path> --noteId=<id>

# Create team note
hackmd-cli team-notes create --teamPath=<team-path> --content='# Team Doc' --description='Summary'

# Create team note inside a folder
hackmd-cli team-notes create --teamPath=<team-path> --parentFolderId=<folder-id> --content='# Team Doc'

# Update team note
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --content='# Updated'
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --title='New title'
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --description='New summary'
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --clear=description

# Move team note into a folder
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --parentFolderId=<folder-id>
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --root

# Delete team note
hackmd-cli team-notes delete --teamPath=<team-path> --noteId=<id>
```

### Personal Folders

```bash
# List all folders
hackmd-cli folders

# Get specific folder
hackmd-cli folders --folderId=<id>

# Create folder
hackmd-cli folders create --name='Docs'

# Create nested folder
hackmd-cli folders create --name='Docs' --parentFolderId=<folder-id>

# Create folder with metadata
hackmd-cli folders create --name='Docs' --description='Project docs' --icon=1F600 --color='#4F46E5'

# Update folder
hackmd-cli folders update --folderId=<id> --name='Updated Docs'
hackmd-cli folders update --folderId=<id> --root
hackmd-cli folders update --folderId=<id> --clear=description --clear=icon --clear=color

# Delete folder
hackmd-cli folders delete --folderId=<id>

# Get / update folder order
hackmd-cli folders order
hackmd-cli folders order --order='{"root":["folder-id-1","folder-id-2"]}'
```

### Team Folders

```bash
# List all team folders
hackmd-cli team-folders --teamPath=<team-path>

# Get specific team folder
hackmd-cli team-folders --teamPath=<team-path> --folderId=<id>

# Create team folder
hackmd-cli team-folders create --teamPath=<team-path> --name='Team Docs'

# Create nested team folder
hackmd-cli team-folders create --teamPath=<team-path> --name='Team Docs' --parentFolderId=<folder-id>

# Create team folder with metadata
hackmd-cli team-folders create --teamPath=<team-path> --name='Team Docs' --description='Project docs' --icon=1F600 --color='#4F46E5'

# Update team folder
hackmd-cli team-folders update --teamPath=<team-path> --folderId=<id> --name='Updated Team Docs'
hackmd-cli team-folders update --teamPath=<team-path> --folderId=<id> --root
hackmd-cli team-folders update --teamPath=<team-path> --folderId=<id> --clear=description

# Delete team folder
hackmd-cli team-folders delete --teamPath=<team-path> --folderId=<id>

# Get / update team folder order
hackmd-cli team-folders order --teamPath=<team-path>
hackmd-cli team-folders order --teamPath=<team-path> --order='{"root":["folder-id-1","folder-id-2"]}'
```

### Teams & History

```bash
hackmd-cli teams              # List accessible teams
hackmd-cli history            # List browsing history
hackmd-cli history --limit=10 # Limit the number of items
```

### Export

```bash
hackmd-cli export --noteId=<id>    # Export note content to stdout
```

## Permissions

Available permission values:

| Permission Type       | Values                                                           |
| --------------------- | ---------------------------------------------------------------- |
| `--readPermission`    | `owner`, `signed_in`, `guest`                                    |
| `--writePermission`   | `owner`, `signed_in`, `guest`                                    |
| `--commentPermission` | `disabled`, `forbidden`, `owners`, `signed_in_users`, `everyone` |

## Note and Folder Update Flags

Omitted fields stay unchanged. `--description=''` sets an empty string; `--clear=description` removes the description. Do not set and clear the same field in one command.

```bash
--parentFolderId=<folder-id>          # Put note/folder inside another folder
--root                                # Move a note/folder to root (update only)
--clear=description                   # Clear note/folder description (update only)
--clear=icon --clear=color             # Clear folder fields (repeatable, update only)
--icon=1F600                          # Emoji unified codepoint string
--color='#4F46E5'                     # Hex color string
--order='{"root":["id1","id2"]}'  # Folder ordering JSON
```

## Output Formats

All list commands support:

```bash
--output=json        # JSON output
--output=yaml        # YAML output
--output=csv         # CSV output (or --csv)
--no-header          # Hide table headers
--no-truncate        # Don't truncate long values
--columns=id,title   # Show specific columns
--columns=id,name,color
--filter=name=foo    # Filter by property
--sort=title         # Sort by property (prepend '-' for descending)
--sort=name
-x, --extended       # Show additional columns
```

## Common Workflows

### Sync local file to HackMD

```bash
# Create new note from file and verify
cat doc.md | hackmd-cli notes create --title="My Doc"
# Confirm creation by retrieving the note
hackmd-cli notes --filter=title="My Doc"

# Update existing note from file and verify
cat doc.md | hackmd-cli notes update --noteId=<id> --title="My Doc"
hackmd-cli export --noteId=<id> | head -5
```

### Create a folder and put a note inside it

```bash
hackmd-cli folders create --name='Docs'
hackmd-cli notes create --parentFolderId=<folder-id> --title='My Note'
```

### Create a nested folder

```bash
hackmd-cli folders create --name='Parent'
hackmd-cli folders create --name='Child' --parentFolderId=<folder-id>
```

### Move an existing note into a folder

```bash
hackmd-cli notes update --noteId=<note-id> --parentFolderId=<folder-id>
```

### Organize team docs in team folders

```bash
hackmd-cli team-folders create --teamPath=<team-path> --name='Team Docs'
hackmd-cli team-notes create --teamPath=<team-path> --parentFolderId=<folder-id> --content='# Team Note'
```

### Export note to local file

```bash
hackmd-cli export --noteId=<id> > note.md
```

### List notes as JSON for scripting

```bash
hackmd-cli notes --output=json | jq '.[] | .id'
```

### Find note by title

```bash
hackmd-cli notes --filter=title=README
```

## Error Handling

Common errors and fixes:

| Error | Cause | Fix |
|-------|-------|-----|
| `Unauthorized` | Invalid or expired token | Re-run `hackmd-cli login` or update `HMD_API_ACCESS_TOKEN` |
| `Not Found` | Wrong `noteId` or `teamPath` | Verify the ID with `hackmd-cli notes` or `hackmd-cli teams` |
| `Forbidden` | Insufficient permissions | Check note permissions with `hackmd-cli notes --noteId=<id> -x` |
