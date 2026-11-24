import type {CreateNoteOptions} from '@hackmd/api'

import {API} from '@hackmd/api'
import {expect} from 'chai'

import {
  cleanupTestConfigDir, clearConfigCache, getTestAPIEndpoint, setupTestConfigDir, shouldRunIntegrationTests,
} from './helpers'

describe('Integration: API Client - Notes', () => {
  let testConfigDir: string
  let apiClient: API
  let createdNoteIds: string[] = []

  async function createTestNote(options: CreateNoteOptions) {
    const result = await apiClient.createNote(options)
    if (result.status === 207) {
      createdNoteIds.push(result.note.id)
      throw new Error(`Unexpected partial note creation: ${result.error}`)
    }

    createdNoteIds.push(result.id)
    return result
  }

  before(function () {
    // Ensure .env is loaded (it should be loaded by init.js, but double-check)
    if (!process.env.HMD_API_ACCESS_TOKEN) {
      const dotenv = require('dotenv')
      // Try to load .env if not already loaded
      const path = require('node:path')
      const envPath = path.resolve(process.cwd(), '.env')
      dotenv.config({override: true, path: envPath})
    }

    if (!shouldRunIntegrationTests()) {
      this.skip()
    }
  })

  beforeEach(() => {
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

  afterEach(async () => {
    // Cleanup: delete created notes
    if (apiClient && createdNoteIds.length > 0) {
      await Promise.all(createdNoteIds.map(async noteId => {
        try {
          await apiClient.deleteNote(noteId)
        } catch {
          // Ignore errors during cleanup
        }
      }))
    }

    createdNoteIds = []

    cleanupTestConfigDir(testConfigDir)
    // Don't delete env vars - they're needed for other tests
  })

  it('should create a new note', async () => {
    const note = await createTestNote({
      commentPermission: 'disabled',
      content: '# Test Content\n\nThis is a test note created by integration tests.',
      readPermission: 'owner',
      title: 'Test Note',
      writePermission: 'owner',
    })

    expect(note).to.have.property('id')
    expect(note).to.have.property('title')
    // Note: Some HackMD instances use content as title, so we check for either
    expect(note.title === 'Test Note' || note.title === 'Test Content').to.be.true
    expect(note).to.have.property('content')
  })

  it('should list user notes', async () => {
    const notes = await apiClient.getNoteList()
    expect(notes).to.be.an('array')
    if (notes.length > 0) {
      expect(notes[0]).to.have.property('id')
      expect(notes[0]).to.have.property('title')
    }
  })

  it('should get a specific note', async () => {
    // Create a note first
    const createdNote = await createTestNote({
      commentPermission: 'disabled',
      content: '# Test Content',
      readPermission: 'owner',
      title: 'Note to Get',
      writePermission: 'owner',
    })

    // Get the note
    const note = await apiClient.getNote(createdNote.id)
    expect(note).to.have.property('id', createdNote.id)
    expect(note).to.have.property('title')
    // Note: Some HackMD instances use content as title, so we check for either
    expect(note.title === 'Note to Get' || note.title === 'Test Content').to.be.true
    expect(note).to.have.property('content')
  })

  it('should update a note', async () => {
    // Create a note first
    const createdNote = await createTestNote({
      commentPermission: 'disabled',
      content: '# Original Content',
      readPermission: 'owner',
      title: 'Note to Update',
      writePermission: 'owner',
    })

    // Update the note
    const update = await apiClient.updateNote(createdNote.id, {
      content: '# Updated Content',
    })

    expect(update.status).to.equal(202)
    const fetchedNote = await apiClient.getNote(createdNote.id)
    expect(fetchedNote.content).to.contain('Updated Content')
  })

  it('should delete a note', async () => {
    // Create a note first
    const createdNote = await createTestNote({
      commentPermission: 'disabled',
      content: '# Test',
      readPermission: 'owner',
      title: 'Note to Delete',
      writePermission: 'owner',
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
