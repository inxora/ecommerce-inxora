import { Metadata } from 'next'
import { LibroReclamacionesForm } from '@/components/libro-reclamaciones/LibroReclamacionesForm'

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones | TIENDA INXORA',
  description:
    'Libro de Reclamaciones Virtual conforme a la Ley N° 29571. Registre su reclamo o queja. Comprometidos a responder en un plazo no mayor a 15 días hábiles.',
  keywords:
    'libro de reclamaciones, reclamos INXORA, quejas consumidor, Indecopi, Ley 29571',
  openGraph: {
    title: 'Libro de Reclamaciones | TIENDA INXORA',
    description:
      'Libro de Reclamaciones Virtual. Registre su reclamo o queja. Respuesta en 15 días hábiles.',
    type: 'website',
  },
}

export default function LibroReclamacionesPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <LibroReclamacionesForm />
    </div>
  )
}
