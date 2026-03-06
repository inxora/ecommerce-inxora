/**
 * Google Drive Picker + descarga para adjuntar archivos al chat de Sara.
 * Flujo: OAuth token (GIS) → Picker → descarga con Drive API (alt=media) → base64.
 * Requiere NEXT_PUBLIC_GOOGLE_CLIENT_ID en el proyecto de Google Cloud (APIs: Picker, Drive).
 */

interface PickerBuilderInstance {
  enableFeature(f: string): PickerBuilderInstance
  setOAuthToken(token: string): PickerBuilderInstance
  setAppId(id: string): PickerBuilderInstance
  addView(v: unknown): PickerBuilderInstance
  setCallback(cb: (data: PickerCallbackData) => void): PickerBuilderInstance
  build(): { setVisible: (v: boolean) => void }
}

declare global {
  interface Window {
    gapi?: {
      load: (name: string, callback: () => void) => void
      picker?: unknown
    }
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: unknown }) => void
          }) => { requestAccessToken: (options?: { prompt?: string }) => void }
        }
      }
      picker: {
        ViewId: { DOCS: string }
        View: new (id: string) => {
          setMimeTypes: (mimes: string) => void
        }
        PickerBuilder: new () => PickerBuilderInstance
        Action: { PICKED: string; CANCEL: string }
        Response: { DOCUMENTS: string }
        Document: { ID: string; MIME_TYPE: string; NAME: string; SIZE: string }
      }
    }
  }
}

export interface PickedDriveFile {
  id: string
  mimeType: string
  name: string
  size?: number
}

interface PickerDoc {
  id?: string
  mimeType?: string
  name?: string
  sizeBytes?: string
}
interface PickerCallbackData {
  action: string
  docs?: PickerDoc[]
}

const SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
const GSI_URL = 'https://accounts.google.com/gsi/client'
const GAPI_URL = 'https://apis.google.com/js/api.js'

function loadScript(src: string): Promise<void> {
  if (typeof document === 'undefined') return Promise.reject(new Error('document undefined'))
  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })
}

function loadGsi(): Promise<void> {
  return loadScript(GSI_URL)
}

function loadGapi(): Promise<void> {
  return loadScript(GAPI_URL)
}

function loadPicker(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('gapi not loaded'))
      return
    }
    window.gapi.load('picker', () => {
      if (window.google?.picker) resolve()
      else reject(new Error('picker not available'))
    })
  })
}

/**
 * Obtiene un token OAuth para Drive (abre popup de Google si hace falta).
 */
export function getDriveAccessToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    loadGsi()
      .then(() => {
        if (!window.google?.accounts?.oauth2?.initTokenClient) {
          reject(new Error('Google Identity Services no disponible'))
          return
        }
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: SCOPE,
          callback: (response: { access_token?: string; error?: unknown }) => {
            if (response.error) {
              reject(response.error)
              return
            }
            if (response.access_token) resolve(response.access_token)
            else reject(new Error('No se obtuvo token'))
          },
        })
        tokenClient.requestAccessToken({ prompt: 'consent' })
      })
      .catch(reject)
  })
}

/**
 * Abre el selector de archivos de Google Drive. Devuelve los archivos elegidos (id, mimeType, name, size).
 */
export function openDrivePicker(
  clientId: string,
  accessToken: string,
  appId?: string
): Promise<PickedDriveFile[]> {
  return loadGapi()
    .then(() => loadPicker())
    .then(
      () =>
        new Promise<PickedDriveFile[]>((resolve, reject) => {
          try {
            const view = new window.google!.picker.View(window.google!.picker.ViewId.DOCS)
            view.setMimeTypes(
              'image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            const builder = new window.google!.picker.PickerBuilder()
              .enableFeature('MULTISELECT_ENABLED')
              .setOAuthToken(accessToken)
              .addView(view)
              .setCallback((data: PickerCallbackData) => {
                if (data.action === window.google!.picker.Action.CANCEL) {
                  resolve([])
                  return
                }
                if (data.action === window.google!.picker.Action.PICKED && data.docs?.length) {
                  resolve(
                    data.docs.map((d) => ({
                      id: d.id ?? '',
                      mimeType: d.mimeType ?? 'application/octet-stream',
                      name: d.name ?? 'archivo',
                      size: d.sizeBytes ? parseInt(d.sizeBytes, 10) : undefined,
                    }))
                  )
                } else {
                  resolve([])
                }
              })
            if (appId) builder.setAppId(appId)
            const picker = builder.build()
            picker.setVisible(true)
          } catch (e) {
            reject(e)
          }
        })
    )
}

/**
 * Descarga un archivo de Drive como binario y lo devuelve en base64 con su content_type.
 */
export async function downloadDriveFileAsBase64(
  accessToken: string,
  fileId: string,
  mimeType: string
): Promise<{ content_type: string; data: string }> {
  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    throw new Error(`Drive: ${res.status} ${res.statusText}`)
  }
  const blob = await res.blob()
  const contentType = mimeType || blob.type || 'application/octet-stream'
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1]! : dataUrl
      resolve({ content_type: contentType, data: base64 })
    }
    reader.onerror = () => reject(new Error('Error leyendo archivo'))
    reader.readAsDataURL(blob)
  })
}
