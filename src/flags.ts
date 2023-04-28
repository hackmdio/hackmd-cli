import {Flags} from '@oclif/core'
export const noteId = Flags.build({
  description: 'HackMD note id'
})

export const teamPath = Flags.build({
  description: 'HackMD team path'
})

export const noteContent = Flags.build({
  description: 'new note content'
})

export const noteTitle = Flags.build({
  description: 'new note title'
})

export const notePermission = Flags.build({
  description: 'set note permission: owner, signed_in, guest'
})

export const commentPermission = Flags.build({
  description: 'set comment permission: disabled, forbidden, owners, signed_in_users, everyone'
})

export const editor = Flags.boolean({
  char: 'e',
  description: 'create note with $EDITOR',
})
