import {expect} from 'chai'

import NotesUpdate from '../src/commands/notes/update'
import TeamNotesUpdate from '../src/commands/team-notes/update'
import {buildNoteUpdatePayload} from '../src/note-update'

describe('Note update payload', () => {
  it('exposes --title for personal and team note updates', () => {
    expect(NotesUpdate.flags).to.have.property('title')
    expect(TeamNotesUpdate.flags).to.have.property('title')
  })

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
      title: 'New title',
      writePermission: 'owner',
    })).to.deep.equal({
      parentFolderId: 'folder-id',
      permalink: 'new-permalink',
      readPermission: 'guest',
      tags: ['tag1', 'tag2'],
      title: 'New title',
      writePermission: 'owner',
    })
  })

  it('allows an explicit empty --content value', () => {
    expect(buildNoteUpdatePayload({content: ''}, '')).to.deep.equal({content: ''})
  })

  it('allows an explicit empty --title value', () => {
    expect(buildNoteUpdatePayload({title: ''})).to.deep.equal({title: ''})
  })
})
