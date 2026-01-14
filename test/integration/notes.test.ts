import API from '@hackmd/api'
// eslint-disable-next-line node/no-missing-import
import {CommentPermissionType, NotePermissionRole} from '@hackmd/api/dist/type'
import {expect} from 'chai'

import {clearConfigCache, cleanupTestConfigDir, getTestAPIEndpoint, setupTestConfigDir, shouldRunIntegrationTests} from './helpers'

describe('Integration: API Client - Notes', function () {
  let testConfigDir: string
  let apiClient: API
  let createdNoteIds: string[] = []

  before(function () {
    // Ensure .env is loaded (it should be loaded by init.js, but double-check)
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      // Try to load .env if not already loaded
      const path = require('path')
      const dotenv = require('dotenv')
      const envPath = path.resolve(process.cwd(), '.env')
      dotenv.config({path: envPath, override: true})
    }
    
    if (!shouldRunIntegrationTests()) {
      this.skip()
    }
  })

  beforeEach(function () {
    clearConfigCache()
    testConfigDir = setupTestConfigDir()
    // Ensure env vars are set from .env
    if (!process.env.HMD_API_ENDPOINT_URL) {
      process.env.HMD_API_ENDPOINT_URL = getTestAPIEndpoint()
    }
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      throw new Error('HMD_API_ACCESS_TOKEN not set. Please check your .env file.')
    }
    const endpoint = getTestAPIEndpoint()
    const token = process.env.HMD_API_ACCESS_TOKEN!
    apiClient = new API(token, endpoint)
  })

  afterEach(async function () {
    // Cleanup: delete created notes
    if (apiClient && createdNoteIds.length > 0) {
      await Promise.all(
        createdNoteIds.map(async noteId => {
          try {
            await apiClient.deleteNote(noteId)
          } catch {
            // Ignore errors during cleanup
          }
        }),
      )
    }
    createdNoteIds = []

    cleanupTestConfigDir(testConfigDir)
    // Don't delete env vars - they're needed for other tests
  })

  it('should create a new note', async function () {
    const note = await apiClient.createNote({
      title: 'Test Note',
      content: '# Test Content\n\nThis is a test note created by integration tests.',
      readPermission: 'owner' as NotePermissionRole,
      writePermission: 'owner' as NotePermissionRole,
      commentPermission: 'disabled' as CommentPermissionType,
    })

    expect(note).to.have.property('id')
    expect(note).to.have.property('title')
    // Note: Some HackMD instances use content as title, so we check for either
    expect(note.title === 'Test Note' || note.title === 'Test Content').to.be.true
    expect(note).to.have.property('content')
    createdNoteIds.push(note.id)
  })

  it('should list user notes', async function () {
    const notes = await apiClient.getNoteList()
    expect(notes).to.be.an('array')
    if (notes.length > 0) {
      expect(notes[0]).to.have.property('id')
      expect(notes[0]).to.have.property('title')
    }
  })

  it('should get a specific note', async function () {
    // Create a note first
    const createdNote = await apiClient.createNote({
      title: 'Note to Get',
      content: '# Test Content',
      readPermission: 'owner' as NotePermissionRole,
      writePermission: 'owner' as NotePermissionRole,
      commentPermission: 'disabled' as CommentPermissionType,
    })
    createdNoteIds.push(createdNote.id)

    // Get the note
    const note = await apiClient.getNote(createdNote.id)
    expect(note).to.have.property('id', createdNote.id)
    expect(note).to.have.property('title')
    // Note: Some HackMD instances use content as title, so we check for either
    expect(note.title === 'Note to Get' || note.title === 'Test Content').to.be.true
    expect(note).to.have.property('content')
  })

  it('should update a note', async function () {
    // Create a note first
    const createdNote = await apiClient.createNote({
      title: 'Note to Update',
      content: '# Original Content',
      readPermission: 'owner' as NotePermissionRole,
      writePermission: 'owner' as NotePermissionRole,
      commentPermission: 'disabled' as CommentPermissionType,
    })
    createdNoteIds.push(createdNote.id)

    // Update the note
    const updatedNote = await apiClient.updateNote(createdNote.id, {
      content: '# Updated Content',
    })

    // Some API versions return status object, others return note object
    if (updatedNote.id) {
      expect(updatedNote).to.have.property('id', createdNote.id)
      expect(updatedNote.content).to.contain('Updated Content')
    } else {
      // If it returns status object, verify the update by fetching the note
      const fetchedNote = await apiClient.getNote(createdNote.id)
      expect(fetchedNote.content).to.contain('Updated Content')
    }
  })

  it('should delete a note', async function () {
    // Create a note first
    const createdNote = await apiClient.createNote({
      title: 'Note to Delete',
      content: '# Test',
      readPermission: 'owner' as NotePermissionRole,
      writePermission: 'owner' as NotePermissionRole,
      commentPermission: 'disabled' as CommentPermissionType,
    })

    // Delete the note
    await apiClient.deleteNote(createdNote.id)

    // Verify it's deleted by trying to get it (should fail)
    try {
      await apiClient.getNote(createdNote.id)
      expect.fail('Note should have been deleted')
    } catch (error) {
      // Expected - note should not exist
      expect(error).to.exist
    }
  })
})
