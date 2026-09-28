import type {UpdateUserFolderBody} from '@hackmd/api'

export type FolderUpdateFlags = {
  clear?: string[]
  color?: string
  description?: string
  icon?: string
  name?: string
  parentFolderId?: string
  root?: boolean
}

export function buildFolderUpdatePayload(flags: FolderUpdateFlags): UpdateUserFolderBody {
  if (flags.root && flags.parentFolderId !== undefined) {
    throw new Error('Use either --root or --parentFolderId, not both')
  }

  const payload: UpdateUserFolderBody = {}
  if (flags.name !== undefined) payload.name = flags.name
  if (flags.description !== undefined) payload.description = flags.description
  if (flags.icon !== undefined) payload.icon = flags.icon
  if (flags.color !== undefined) payload.color = flags.color
  if (flags.parentFolderId !== undefined) payload.parentFolderId = flags.parentFolderId

  for (const field of flags.clear ?? []) {
    if (field !== 'description' && field !== 'icon' && field !== 'color') {
      throw new Error(`Cannot clear folder field: ${field}`)
    }

    if (flags[field] !== undefined) throw new Error(`Use either --${field} or --clear=${field}, not both`)
    payload[field] = null
  }

  if (flags.root) payload.parentFolderId = null

  return payload
}
