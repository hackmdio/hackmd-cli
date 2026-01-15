---
name: hackmd-cli
description: HackMD command-line interface for managing notes and team notes. Use this skill when users want to create, read, update, delete, or export HackMD notes via CLI, manage team notes, list teams, view browsing history, or automate HackMD workflows. Triggers on mentions of hackmd-cli, HackMD CLI, or requests to interact with HackMD notes programmatically.
---

# HackMD CLI

Command-line tool for managing HackMD notes and team notes via the HackMD API.

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

# Create from file/stdin
cat README.md | hackmd-cli notes create

# Create with editor
hackmd-cli notes create -e

# Update note
hackmd-cli notes update --noteId=<id> --content='# New Content'

# Delete note
hackmd-cli notes delete --noteId=<id>
```

### Team Notes

```bash
# List team notes
hackmd-cli team-notes --teamPath=<team-path>

# Create team note
hackmd-cli team-notes create --teamPath=<team-path> --content='# Team Doc'

# Update team note
hackmd-cli team-notes update --teamPath=<team-path> --noteId=<id> --content='# Updated'

# Delete team note
hackmd-cli team-notes delete --teamPath=<team-path> --noteId=<id>
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

| Permission Type | Values |
|----------------|--------|
| `--readPermission` | `owner`, `signed_in`, `guest` |
| `--writePermission` | `owner`, `signed_in`, `guest` |
| `--commentPermission` | `disabled`, `forbidden`, `owners`, `signed_in_users`, `everyone` |

## Output Formats

All list commands support:

```bash
--output=json        # JSON output
--output=yaml        # YAML output
--output=csv         # CSV output (or --csv)
--no-header          # Hide table headers
--no-truncate        # Don't truncate long values
--columns=id,title   # Show specific columns
--filter=name=foo    # Filter by property
--sort=title         # Sort by property (prepend '-' for descending)
-x, --extended       # Show additional columns
```

## Common Workflows

### Sync local file to HackMD

```bash
# Create new note from file
cat doc.md | hackmd-cli notes create --title="My Doc"

# Update existing note from file
cat doc.md | hackmd-cli notes update --noteId=<id>
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
