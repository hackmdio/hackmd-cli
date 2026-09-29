import {expect} from 'chai'

import NotesCreate from '../src/commands/notes/create'
import NotesUpdate from '../src/commands/notes/update'
import TeamNotesCreate from '../src/commands/team-notes/create'
import TeamNotesUpdate from '../src/commands/team-notes/update'
import {buildNoteUpdatePayload} from '../src/note-update'

describe('Note update payload', () => {
  it('exposes --title for personal and team note updates', () => {
    expect(NotesUpdate.flags).to.have.property('title')
    expect(TeamNotesUpdate.flags).to.have.property('title')
  })

  it('exposes --description for personal and team create and update', () => {
    for (const command of [NotesCreate, TeamNotesCreate, NotesUpdate, TeamNotesUpdate]) {
      expect(command.flags).to.have.property('description')
    }
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

  it('preserves an empty description and moves a note to root with null', () => {
    expect(buildNoteUpdatePayload({description: '', root: true})).to.deep.equal({
      description: '',
      parentFolderId: null,
    })
  })

  it('rejects both root and a parent folder ID', () => {
    expect(() => buildNoteUpdatePayload({parentFolderId: 'folder-id', root: true}))
    .to.throw('Use either --root or --parentFolderId, not both')
  })

  it('exposes --clear for personal and team note updates', () => {
    for (const command of [NotesUpdate, TeamNotesUpdate]) expect(command.flags).to.have.property('clear')
  })

  it('clears a description with null', () => {
    expect(buildNoteUpdatePayload({clear: ['description']})).to.deep.equal({description: null})
  })

  it('rejects clearing and setting the same description, including an empty string', () => {
    for (const description of ['Text', '']) {
      expect(() => buildNoteUpdatePayload({clear: ['description'], description}))
      .to.throw('Use either --description or --clear=description, not both')
    }
  })

  it('rejects fields that cannot be cleared', () => {
    expect(() => buildNoteUpdatePayload({clear: ['title']})).to.throw('Cannot clear note field: title')
  })
})
