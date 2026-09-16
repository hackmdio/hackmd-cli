import type {NotePermissionRole, UpdateNoteOptions} from '@hackmd/api'

export type NoteUpdateFlags = {
  content?: string
  parentFolderId?: string
  permalink?: string
  readPermission?: string
  tags?: string
  title?: string
  writePermission?: string
}

export function buildNoteUpdatePayload(
  {content, parentFolderId, permalink, readPermission, tags, title, writePermission}: NoteUpdateFlags,
  stdinContent?: string,
): UpdateNoteOptions {
  if (stdinContent && content !== undefined) {
    throw new Error('Content cannot be provided from both stdin and --content')
  }

  const payload: UpdateNoteOptions = {}
  const resolvedContent = stdinContent || content

  if (resolvedContent !== undefined) payload.content = resolvedContent
  if (parentFolderId !== undefined) payload.parentFolderId = parentFolderId
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
