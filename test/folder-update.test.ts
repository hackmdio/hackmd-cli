import {expect} from 'chai'

import FoldersUpdate from '../src/commands/folders/update'
import TeamFoldersUpdate from '../src/commands/team-folders/update'
import {buildFolderUpdatePayload} from '../src/folder-update'

describe('Folder update payload', () => {
  it('exposes root and clear flags for personal and team folders', () => {
    for (const command of [FoldersUpdate, TeamFoldersUpdate]) {
      for (const flag of ['root', 'clear']) {
        expect(command.flags).to.have.property(flag)
      }
    }
  })

  it('omits unchanged fields', () => {
    expect(buildFolderUpdatePayload({name: 'Docs'})).to.deep.equal({name: 'Docs'})
  })

  it('preserves an empty string when setting a field', () => {
    expect(buildFolderUpdatePayload({description: ''})).to.deep.equal({description: ''})
  })

  it('uses null only for explicitly cleared fields', () => {
    expect(buildFolderUpdatePayload({
      clear: ['color', 'description', 'icon'],
      root: true,
    })).to.deep.equal({
      color: null,
      description: null,
      icon: null,
      parentFolderId: null,
    })
  })

  it('rejects root with a parent folder ID', () => {
    expect(() => buildFolderUpdatePayload({parentFolderId: 'folder-id', root: true}))
    .to.throw('Use either --root or --parentFolderId, not both')
  })

  it('rejects fields that cannot be cleared', () => {
    expect(() => buildFolderUpdatePayload({clear: ['name']})).to.throw('Cannot clear folder field: name')
  })

  for (const field of ['color', 'description', 'icon'] as const) {
    it(`rejects --${field} with --clear=${field}`, () => {
      expect(() => buildFolderUpdatePayload({clear: [field], [field]: 'value'}))
      .to.throw(`Use either --${field} or --clear=${field}, not both`)
    })
  }
})
