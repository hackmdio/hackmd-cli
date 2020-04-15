import cheerio from 'cheerio'
import * as fs from 'fs-extra'
import nodeFetch from 'node-fetch'
import tough = require('tough-cookie')
import FileCookieStore from 'tough-cookie-filestore'
import * as url from 'url'

import config from './config'

interface APIOptions {
  serverUrl: string
  cookiePath: string,
  enterprise: boolean
}

type nodeFetchType = (url: RequestInfo, init?: RequestInit | undefined) => Promise<Response>

function encodeFormComponent(form: object) {
  return Object.entries(form).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
}

export enum ExportType {
  PDF,
  SLIDE,
  MD,
  HTML
}

export type HistoryItem = {
  id: string
  text: string
  time: number | string
  tags: string[]
}

/**
 * codimd API Client
 */
class API {
  public readonly serverUrl: string
  private readonly enterprise: boolean
  private readonly _fetch: nodeFetchType

  constructor() {
    const {serverUrl, cookiePath, enterprise}: APIOptions = config

    fs.ensureFileSync(cookiePath)

    const jar = new FileCookieStore(cookiePath)
    const fetch: nodeFetchType = require('fetch-cookie')(nodeFetch, new tough.CookieJar(jar as any))

    this._fetch = fetch
    this.serverUrl = serverUrl
    this.enterprise = enterprise
  }

  async login(email: string, password: string) {
    const response = await this.fetch(`${this.serverUrl}/login`, {
      method: 'post',
      body: encodeFormComponent({email, password}),
      headers: await this.wrapHeaders({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      })
    })

    return response.status === 200
  }

  async loginLdap(username: string, password: string) {
    const response = await this.fetch(`${this.serverUrl}/auth/ldap`, {
      method: 'post',
      body: encodeFormComponent({username, password}),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
    return response.status === 200
  }

  async logout() {
    const response = await this.fetch(`${this.serverUrl}/logout`, {
      method: this.enterprise ? 'POST' : 'GET',
      headers: await this.wrapHeaders({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      })
    })
    return response.status === 200
  }

  async isLogin() {
    const response = await this.fetch(`${this.serverUrl}/me`)
    return response.status === 200
  }

  async getMe() {
    const response = await this.fetch(`${this.serverUrl}/me`)
    return response.json()
  }

  async getHistory(): Promise<{ history: HistoryItem[] }> {
    const response = await this.fetch(`${this.serverUrl}/history`)
    return response.json()
  }

  async newNote(body: string) {
    const contentType = 'text/markdown;charset=UTF-8'
    const response = await this.fetch(`${this.serverUrl}/new`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': contentType
      }
    })
    if (response.status === 200) {
      return response.url
    } else {
      throw new Error('Create note failed')
    }
  }

  async export(noteId: string, type: ExportType, output: string) {
    let res: Response
    switch (type) {
    case ExportType.PDF:
      res = await this.fetch(`${this.serverUrl}/${noteId}/pdf`)
      break
    case ExportType.HTML:
      res = await this.fetch(`${this.serverUrl}/s/${noteId}`)
      break
    case ExportType.SLIDE:
      res = await this.fetch(`${this.serverUrl}/${noteId}/slide`)
      break
    case ExportType.MD:
    default:
      res = await this.fetch(`${this.serverUrl}/${noteId}/download`)
    }

    return this.downloadFile(res, output)
  }

  private async downloadFile(res: any, output: string) {
    const fileStream = fs.createWriteStream(output)

    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream)
      res.body.on('error', (err: any) => {
        reject(err)
      })
      fileStream.on('finish', function () {
        resolve()
      })
    })
  }

  get fetch() {
    return this._fetch
  }

  get domain() {
    return url.parse(this.serverUrl).host
  }

  private async wrapHeaders(headers: any) {
    if (this.enterprise) {
      const csrf = await this.loadCSRFToken()
      return {
        ...headers,
        'X-XSRF-Token': csrf
      }
    } else {
      return headers
    }
  }

  private async loadCSRFToken() {
    const html = await this.fetch(`${this.serverUrl}`).then(r => r.text())
    const $ = cheerio.load(html)

    return $('meta[name="csrf-token"]').attr('content') || ''
  }
}

export default API

export const APIClient = new API()
