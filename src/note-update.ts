import type {NotePermissionRole, UpdateNoteOptions} from '@hackmd/api'

export type NoteUpdateFlags = {
  clear?: string[]
  content?: string
  description?: string
  parentFolderId?: string
  permalink?: string
  readPermission?: string
  root?: boolean
  tags?: string
  title?: string
  writePermission?: string
}

export function buildNoteUpdatePayload(
  {clear = [], content, description, parentFolderId, permalink, readPermission, root, tags, title, writePermission}: NoteUpdateFlags,
  stdinContent?: string,
): UpdateNoteOptions {
  if (stdinContent && content !== undefined) {
    throw new Error('Content cannot be provided from both stdin and --content')
  }

  if (root && parentFolderId !== undefined) {
    throw new Error('Use either --root or --parentFolderId, not both')
  }

  const payload: UpdateNoteOptions = {}
  const resolvedContent = stdinContent || content

  if (resolvedContent !== undefined) payload.content = resolvedContent
  if (description !== undefined) payload.description = description

  for (const field of clear) {
    if (field !== 'description') throw new Error(`Cannot clear note field: ${field}`)
    if (description !== undefined) throw new Error('Use either --description or --clear=description, not both')
    payload.description = null
  }

  if (parentFolderId !== undefined) payload.parentFolderId = parentFolderId
  if (root) payload.parentFolderId = null
  if (readPermission !== undefined) payload.readPermission = readPermission as NotePermissionRole
  if (writePermission !== undefined) payload.writePermission = writePermission as NotePermissionRole
  if (permalink !== undefined) payload.permalink = permalink
  if (tags !== undefined) payload.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean)
  if (title !== undefined) payload.title = title

  if (Object.keys(payload).length === 0) {
    throw new Error('Nothing to update')
  }

  return payload
}
