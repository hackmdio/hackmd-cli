import {Flags} from '@oclif/core'
export const noteId = Flags.string({
  description: 'HackMD note id'
})

export const teamPath = Flags.string({
  description: 'HackMD team path'
})

export const noteContent = Flags.string({
  description: 'new note content'
})

export const noteTitle = Flags.string({
  description: 'new note title'
})

export const notePermission = Flags.string({
  description: 'set note permission: owner, signed_in, guest'
})

export const commentPermission = Flags.string({
  description: 'set comment permission: disabled, forbidden, owners, signed_in_users, everyone'
})

export const editor = Flags.boolean({
  char: 'e',
  description: 'create note with $EDITOR',
})
