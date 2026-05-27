---
name: hackmd-cli
description: HackMD command-line interface for managing personal/team notes and folders. Use this skill when users want to create, read, update, delete, reorder, or export HackMD notes and folders via CLI, manage team content, list teams, view browsing history, or automate HackMD workflows.
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
hackmd-cli notes create --content='# Title' --title='My Note'
hackmd-cli notes create --readPermission=owner --writePermission=owner

# Create note inside a folder
hackmd-cli notes create --parentFolderId=<folder-id> --content='# Title'

# Create from file/stdin
cat README.md | hackmd-cli notes create

# Create with editor
hackmd-cli notes create -e

# Update note
hackmd-cli notes update --noteId=<id> --content='# New Content'

# Move note into a folder
hackmd-cli notes update --noteId=<id> --parentFolderId=<folder-id>

# Delete note
hackmd-cli notes delete --noteId=<id>
```

### Team Notes

```bash
# List team notes
hackmd-cli team-notes --teamPath=<team-path>

# Create team note
hackmd-cli team-notes create --teamPath=<team-path> --content='# Team Doc'

# Create team note inside a folder
hackmd-cli team-notes create --teamPath=<team-path> --parentFolderId=<folder-id> --content='# Team Doc'

# Update team note
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --content='# Updated'

# Move team note into a folder
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --parentFolderId=<folder-id>

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

## Folder Flags

```bash
--parentFolderId=<folder-id>          # Put note/folder inside another folder
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
cat doc.md | hackmd-cli notes update --noteId=<id>
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
