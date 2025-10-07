"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  const locale = pathname?.split('/')?.[1] || 'es'

  const footerLinks = {
    company: [
      { name: 'Nosotros', href: `/${locale}/nosotros` },
      { name: 'Contacto', href: `/${locale}/contacto` },
      { name: 'FAQ', href: `/${locale}/faq` },
      { name: 'Cotizaciones', href: `/${locale}/cotizaciones` },
    ],
    legal: [
      { name: 'Términos', href: `/${locale}/terminos` },
      { name: 'Privacidad', href: `/${locale}/privacidad` },
      { name: 'Envíos', href: `/${locale}/envios` },
      { name: 'Devoluciones', href: `/${locale}/devoluciones` },
    ],
    categories: [
      { name: 'Catálogo', href: `/${locale}/catalogo` },
      { name: 'Suministros', href: `/${locale}/catalogo?categoria=suministros-industriales` },
      { name: 'Seguridad', href: `/${locale}/catalogo?categoria=equipos-seguridad` },
      { name: 'Herramientas', href: `/${locale}/catalogo?categoria=herramientas` },
    ]
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-inxora-blue via-inxora-blue to-inxora-purple text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-inxora-cyan to-inxora-pink flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <div>
                <span className="text-lg font-bold">INXORA</span>
                <p className="text-xs text-blue-200">Marketplace Industrial</p>
              </div>
            </div>
            
            <p className="text-sm text-blue-100 leading-relaxed">
              Tu socio estratégico en suministros industriales y equipos de seguridad.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 text-inxora-cyan" />
                <span className="text-xs text-blue-100">Av. Óscar R. Benavides 3046, Lima 15081, Perú</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-inxora-cyan" />
                <span className="text-xs text-blue-100">+51 946 885 531</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-inxora-cyan" />
                <span className="text-xs text-blue-100">contacto@inxora.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="h-7 w-7 rounded bg-white/10 flex items-center justify-center hover:bg-inxora-cyan transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-3 w-3 text-blue-200" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h3 className="font-medium text-white mb-3 relative">
              Empresa
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-inxora-cyan to-inxora-pink rounded-full" />
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs text-blue-200 hover:text-inxora-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h3 className="font-medium text-white mb-3 relative">
              Categorías
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-inxora-cyan to-inxora-pink rounded-full" />
            </h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs text-blue-200 hover:text-inxora-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-medium text-white mb-3 relative">
              Legal
              <div className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-inxora-cyan to-inxora-pink rounded-full" />
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-xs text-blue-200 hover:text-inxora-cyan transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-200 text-center md:text-left">
            © 2025 INXORA. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-3 text-xs text-blue-300">
            <span>Desarrollado con</span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-white/10 rounded text-xs">Next.js</span>
              <span className="text-blue-300">•</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs">Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}