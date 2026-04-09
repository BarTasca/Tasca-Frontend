import { ApiError } from '@/lib/http'

function firstValidationMessage(body: any): string | null {
  if (!body?.errors || typeof body.errors !== 'object') return null

  if (Array.isArray(body.errors.FullName) && body.errors.FullName.length > 0) {
    return 'Introduce tu nombre.'
  }

  if (Array.isArray(body.errors.Phone) && body.errors.Phone.length > 0) {
    return 'Introduce un teléfono numero de telefono valido'
  }

  if (Array.isArray(body.errors.PeopleCount) && body.errors.PeopleCount.length > 0) {
    return 'Indica para cuántas personas es la mesa.'
  }

  if (Array.isArray(body.errors.QrToken) && body.errors.QrToken.length > 0) {
    return 'El QR no es válido. Vuelve a escanear el QR de la pantalla.'
  }

  const firstEntry = Object.values(body.errors).find(
    (value): value is string[] => Array.isArray(value) && value.length > 0,
  )

  if (firstEntry?.length) return firstEntry[0]

  return null
}

export function mapCreateTicketError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return 'No se pudo crear el turno. Inténtalo de nuevo.'
  }

  const body = error.body as any
  const code = body?.code

  if (error.status === 409 && code === 'SERVICE_CLOSED') {
    return 'El servicio está cerrado en este momento.'
  }

  if (error.status === 410 && (code === 'QR_EXPIRED' || code === 'QR_TOKEN_REQUIRED')) {
    return 'El QR ha caducado. Vuelve a escanear el QR de la pantalla.'
  }

  if (error.status === 400) {
    const validationMessage = firstValidationMessage(body)
    if (validationMessage) return validationMessage

    return 'Revisa los datos del formulario y vuelve a intentarlo.'
  }

  if (error.status === 401) {
    return 'No se ha podido validar la solicitud. Vuelve a intentarlo.'
  }

  if (error.status === 403) {
    return 'No tienes permisos para realizar esta acción.'
  }

  if (error.status >= 500) {
    return 'Ha ocurrido un error interno. Inténtalo de nuevo en unos minutos.'
  }

  return 'No se pudo crear el turno. Inténtalo de nuevo.'
}