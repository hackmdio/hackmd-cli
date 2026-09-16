import {expect} from 'chai'

import {buildNoteUpdatePayload} from '../src/note-update'

describe('Note update payload', () => {
  it('uses piped stdin content without changing it', () => {
    const content = '# Piped content\n\nBody with trailing newline.\n'

    expect(buildNoteUpdatePayload({}, content)).to.deep.equal({content})
  })

  it('uses --content when stdin is empty', () => {
    expect(buildNoteUpdatePayload({content: '# Flag content'}, '')).to.deep.equal({
      content: '# Flag content',
    })
  })

  it('rejects content from both stdin and --content', () => {
    expect(() => buildNoteUpdatePayload({content: '# Flag content'}, '# Piped content'))
    .to.throw('Content cannot be provided from both stdin and --content')
  })

  it('rejects an empty update', () => {
    expect(() => buildNoteUpdatePayload({}, '')).to.throw('Nothing to update')
  })

  it('allows metadata-only updates', () => {
    expect(buildNoteUpdatePayload({
      parentFolderId: 'folder-id',
      permalink: 'new-permalink',
      readPermission: 'guest',
      tags: ' tag1, tag2, ,',
      writePermission: 'owner',
    })).to.deep.equal({
      parentFolderId: 'folder-id',
      permalink: 'new-permalink',
      readPermission: 'guest',
      tags: ['tag1', 'tag2'],
      writePermission: 'owner',
    })
  })

  it('allows an explicit empty --content value', () => {
    expect(buildNoteUpdatePayload({content: ''}, '')).to.deep.equal({content: ''})
  })
})
