import {Flags} from '@oclif/core'
export const noteId = Flags.string({
  description: 'HackMD note id',
})

export const folderId = Flags.string({
  description: 'HackMD folder id',
})

export const teamPath = Flags.string({
  description: 'HackMD team path',
})

export const noteContent = Flags.string({
  description: 'new note content',
})

export const noteTitle = Flags.string({
  description: 'new note title',
})

export const folderName = Flags.string({
  description: 'folder name',
})

export const folderDescription = Flags.string({
  description: 'folder description',
})

export const folderIcon = Flags.string({
  description: 'folder icon',
})

export const folderColor = Flags.string({
  description: 'folder color',
})

export const parentFolderId = Flags.string({
  description: 'parent folder id',
})

export const folderOrder = Flags.string({
  description: 'folder order JSON, e.g. {"root":["folder-id"]}',
})

export const notePermission = Flags.string({
  description: 'set note permission: owner, signed_in, guest',
})

export const commentPermission = Flags.string({
  description: 'set comment permission: disabled, forbidden, owners, signed_in_users, everyone',
})

export const editor = Flags.boolean({
  char: 'e',
  description: 'create note with $EDITOR',
})
