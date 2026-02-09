'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LibroReclamacionesService } from '@/lib/services/libro-reclamaciones.service'
import { UbigeoService, type Ciudad, type Provincia, type Distrito } from '@/lib/services/ubigeo.service'
import { ApiError } from '@/lib/api/client'

const DEPARTAMENTOS_FALLBACK = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
  'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
  'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
  'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
]

export function LibroReclamacionesForm() {
  const router = useRouter()
  const t = useTranslations('libroReclamaciones')
  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    tipoDoc: 'DNI',
    numDoc: '',
    celular: '',
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    referencia: '',
    email: '',
    menorEdad: 'no' as 'si' | 'no',
    tutorNombre: '',
    tutorEmail: '',
    tutorTipoDoc: 'DNI',
    tutorNumDoc: '',
    tipoReclamo: 'Reclamación',
    tipoConsumo: 'Producto',
    numPedido: '',
    fechaReclamo: '',
    proveedor: 'INXORA S.A.C. (RUC: 20614841681)',
    monto: '',
    descripcion: '',
    fechaCompra: '',
    fechaConsumo: '',
    fechaCaducidad: '',
    detalle: '',
    pedidoCliente: '',
    acepta: false,
  })
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [distritos, setDistritos] = useState<Distrito[]>([])
  const [idCiudadSelected, setIdCiudadSelected] = useState<number | null>(null)
  const [idProvinciaSelected, setIdProvinciaSelected] = useState<number | null>(null)
  const [idDistritoSelected, setIdDistritoSelected] = useState<number | null>(null)
  const [loadingUbigeo, setLoadingUbigeo] = useState({ ciudades: false, provincias: false, distritos: false })

  const usaUbigeoApi = ciudades.length > 0

  useEffect(() => {
    let cancelled = false
    setLoadingUbigeo((l) => ({ ...l, ciudades: true }))
    UbigeoService.getCiudades(1)
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setCiudades(data)
      })
      .finally(() => setLoadingUbigeo((l) => ({ ...l, ciudades: false })))
    return () => { cancelled = true }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleDepartamentoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!usaUbigeoApi) {
      handleChange(e)
      return
    }
    const id = val ? Number(val) : null
    setIdCiudadSelected(id)
    setForm((f) => ({
      ...f,
      departamento: id ? (ciudades.find((c) => c.id === id)?.nombre ?? '') : '',
      provincia: '',
      distrito: '',
    }))
    setIdProvinciaSelected(null)
    setIdDistritoSelected(null)
    setProvincias([])
    setDistritos([])
    if (id) {
      setLoadingUbigeo((l) => ({ ...l, provincias: true }))
      const prov = await UbigeoService.getProvinciasByCiudad(id)
      if (!prov.length) setProvincias([])
      else setProvincias(prov)
      setLoadingUbigeo((l) => ({ ...l, provincias: false }))
    }
  }

  const handleProvinciaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!usaUbigeoApi) {
      handleChange(e)
      return
    }
    const id = val ? Number(val) : null
    setIdProvinciaSelected(id)
    setForm((f) => ({
      ...f,
      provincia: id ? (provincias.find((p) => p.id === id)?.nombre ?? '') : '',
      distrito: '',
    }))
    setIdDistritoSelected(null)
    setDistritos([])
    if (id) {
      setLoadingUbigeo((l) => ({ ...l, distritos: true }))
      const dist = await UbigeoService.getDistritosByProvincia(id)
      setDistritos(dist ?? [])
      setLoadingUbigeo((l) => ({ ...l, distritos: false }))
    }
  }

  const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!usaUbigeoApi) {
      handleChange(e)
      return
    }
    const id = val ? Number(val) : null
    setIdDistritoSelected(id)
    setForm((f) => ({
      ...f,
      distrito: id ? (distritos.find((d) => d.id === id)?.nombre ?? '') : '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nombre || !form.apellido1 || !form.tipoDoc || !form.numDoc || !form.celular || !form.departamento || !form.direccion || !form.email || !form.descripcion || !form.detalle || !form.acepta) {
      setError(t('validaciones.camposObligatorios'))
      return
    }

    if (!form.pedidoCliente?.trim() && !form.numPedido?.trim()) {
      setError(t('validaciones.camposObligatorios'))
      return
    }

    if (!form.celular.match(/^[0-9]{9}$/)) {
      setError(t('validaciones.telefonoFormato'))
      return
    }

    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError(t('validaciones.emailInvalido'))
      return
    }

    setSubmitting(true)
    try {
      const res = await LibroReclamacionesService.crearReclamo({
        nombre: form.nombre,
        apellido1: form.apellido1,
        apellido2: form.apellido2 || undefined,
        tipoDoc: form.tipoDoc,
        numDoc: form.numDoc,
        celular: form.celular,
        email: form.email,
        departamento: form.departamento || undefined,
        provincia: form.provincia || undefined,
        distrito: form.distrito || undefined,
        direccion: form.direccion || undefined,
        referencia: form.referencia || undefined,
        menorEdad: form.menorEdad === 'si',
        tutorNombre: form.tutorNombre || undefined,
        tutorEmail: form.tutorEmail || undefined,
        tutorTipoDoc: form.tutorTipoDoc || undefined,
        tutorNumDoc: form.tutorNumDoc || undefined,
        tipoReclamo: form.tipoReclamo,
        tipoConsumo: form.tipoConsumo,
        numPedido: form.numPedido || undefined,
        pedidoCliente: form.pedidoCliente || undefined,
        fechaReclamo: form.fechaReclamo || undefined,
        idEmpresaEmisora: 1,
        monto: form.monto ? Number(form.monto) : undefined,
        descripcion: form.descripcion,
        fechaCompra: form.fechaCompra || undefined,
        fechaConsumo: form.fechaConsumo || undefined,
        fechaCaducidad: form.fechaCaducidad || undefined,
        detalle: form.detalle,
        acepta: form.acepta,
      })

      if (res.success) {
        setEnviado(true)
      } else {
        setError(res.message || res.error || 'Error al enviar el reclamo')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al enviar el reclamo')
      } else {
        setError(err instanceof Error ? err.message : 'Error al enviar el reclamo')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-gray-800 dark:text-gray-200">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-inxora-cyan text-white rounded-lg hover:bg-inxora-blue transition-colors font-medium shadow"
      >
        {t('atras')}
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-inxora-blue dark:text-inxora-aqua mb-6 text-center">
        {t('title')}
      </h1>
      <p className="mb-6 text-justify text-gray-600 dark:text-gray-400">{t('subtitle')}</p>

      {enviado ? (
        <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 mb-6 rounded text-center text-base md:text-lg">
          {t('exito')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <fieldset className="border border-inxora-cyan/40 rounded-lg p-4 sm:p-6 bg-white/50 dark:bg-gray-900/50">
            <legend className="font-semibold text-inxora-cyan">{t('datosConsumidor')}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2">
              <div>
                <label className="block font-medium mb-1">{t('nombre')}</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('primerApellido')}</label>
                <input
                  name="apellido1"
                  value={form.apellido1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="family-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('segundoApellido')}</label>
                <input
                  name="apellido2"
                  value={form.apellido2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  autoComplete="family-name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('tipoDocumento')}</label>
                <select
                  name="tipoDoc"
                  value={form.tipoDoc}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="DNI">{t('dni')}</option>
                  <option value="CE">{t('ce')}</option>
                  <option value="Pasaporte">{t('pasaporte')}</option>
                  <option value="RUC">{t('ruc')}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t('numeroDocumento')}</label>
                <input
                  name="numDoc"
                  value={form.numDoc}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="off"
                  maxLength={11}
                  pattern="[0-9]{8,11}"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('celular')}</label>
                <input
                  name="celular"
                  value={form.celular}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="tel"
                  maxLength={9}
                  pattern="[0-9]{9}"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('departamento')}</label>
                <select
                  name="departamento"
                  value={usaUbigeoApi ? (idCiudadSelected ?? '') : form.departamento}
                  onChange={handleDepartamentoChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  disabled={loadingUbigeo.ciudades}
                >
                  <option value="">{loadingUbigeo.ciudades ? t('cargando') : t('selecciona')}</option>
                  {usaUbigeoApi
                    ? ciudades.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))
                    : DEPARTAMENTOS_FALLBACK.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t('provincia')}</label>
                {usaUbigeoApi ? (
                  <select
                    name="provincia"
                    value={idProvinciaSelected ?? ''}
                    onChange={handleProvinciaChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    disabled={!idCiudadSelected || loadingUbigeo.provincias}
                    autoComplete="address-level1"
                  >
                    <option value="">{loadingUbigeo.provincias ? t('cargando') : t('selecciona')}</option>
                    {provincias.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="provincia"
                    value={form.provincia}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    autoComplete="address-level1"
                  />
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">{t('distrito')}</label>
                {usaUbigeoApi ? (
                  <select
                    name="distrito"
                    value={idDistritoSelected ?? ''}
                    onChange={handleDistritoChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    disabled={!idProvinciaSelected || loadingUbigeo.distritos}
                    autoComplete="address-level2"
                  >
                    <option value="">{loadingUbigeo.distritos ? t('cargando') : t('selecciona')}</option>
                    {distritos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="distrito"
                    value={form.distrito}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    autoComplete="address-level2"
                  />
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">{t('direccion')}</label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="street-address"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('referencia')}</label>
                <input
                  name="referencia"
                  value={form.referencia}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('correoElectronico')}</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('menorEdad')}</label>
                <select
                  name="menorEdad"
                  value={form.menorEdad}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="no">{t('no')}</option>
                  <option value="si">{t('si')}</option>
                </select>
              </div>
              {form.menorEdad === 'si' && (
                <>
                  <div>
                    <label className="block font-medium mb-1">{t('nombreTutor')}</label>
                    <input
                      name="tutorNombre"
                      value={form.tutorNombre}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t('correoTutor')}</label>
                    <input
                      name="tutorEmail"
                      type="email"
                      value={form.tutorEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t('tipoDocumentoTutor')}</label>
                    <select
                      name="tutorTipoDoc"
                      value={form.tutorTipoDoc}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                    >
                      <option value="DNI">{t('dni')}</option>
                      <option value="CE">{t('ce')}</option>
                      <option value="Pasaporte">{t('pasaporte')}</option>
                      <option value="RUC">{t('ruc')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">{t('numeroDocumentoTutor')}</label>
                    <input
                      name="tutorNumDoc"
                      value={form.tutorNumDoc}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                      maxLength={11}
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>

          <fieldset className="border border-inxora-cyan/40 rounded-lg p-4 sm:p-6 bg-white/50 dark:bg-gray-900/50">
            <legend className="font-semibold text-inxora-cyan">{t('detalleReclamo')}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2">
              <div>
                <label className="block font-medium mb-1">{t('tipoReclamo')}</label>
                <select
                  name="tipoReclamo"
                  value={form.tipoReclamo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="Reclamación">{t('reclamacion')}</option>
                  <option value="Queja">{t('queja')}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t('tipoConsumo')}</label>
                <select
                  name="tipoConsumo"
                  value={form.tipoConsumo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="Producto">{t('producto')}</option>
                  <option value="Servicio">{t('servicio')}</option>
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">{t('numeroPedido')}</label>
                <input
                  name="numPedido"
                  value={form.numPedido}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('fechaReclamo')}</label>
                <input
                  name="fechaReclamo"
                  type="date"
                  value={form.fechaReclamo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('proveedor')}</label>
                <input
                  name="proveedor"
                  value={form.proveedor}
                  readOnly
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('montoReclamado')}</label>
                <input
                  name="monto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.monto}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('descripcionProducto')}</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  rows={2}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('fechaCompra')}</label>
                <input
                  name="fechaCompra"
                  type="date"
                  value={form.fechaCompra}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('fechaConsumo')}</label>
                <input
                  name="fechaConsumo"
                  type="date"
                  value={form.fechaConsumo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t('fechaCaducidad')}</label>
                <input
                  name="fechaCaducidad"
                  type="date"
                  value={form.fechaCaducidad}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('detalleReclamacion')}</label>
                <textarea
                  name="detalle"
                  value={form.detalle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  required
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium mb-1">{t('pedidoCliente')}</label>
                <textarea
                  name="pedidoCliente"
                  value={form.pedidoCliente}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800"
                  rows={3}
                  placeholder={t('pedidoCliente')}
                />
              </div>
            </div>
          </fieldset>

          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>{t('avisosLegales.linea1')}</p>
            <p>{t('avisosLegales.linea2')}</p>
            <p>{t('avisosLegales.linea3')}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="checkbox"
              id="acepta"
              name="acepta"
              checked={form.acepta}
              onChange={handleChange}
              className="rounded"
              required
            />
            <label htmlFor="acepta" className="text-sm">
              {t('politicaPrivacidad')}
            </label>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 font-medium">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-inxora-cyan hover:bg-inxora-blue text-white px-4 py-3 rounded-lg font-semibold shadow transition-colors flex items-center justify-center disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                {t('enviando')}
              </>
            ) : (
              t('enviarReclamo')
            )}
          </button>
        </form>
      )}
    </section>
  )
}
