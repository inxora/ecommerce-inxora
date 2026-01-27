'use client'

const WHATSAPP_NUMBER = '946885531' // Número de WhatsApp de INXORA (sin +)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

/**
 * Botón flotante de WhatsApp
 * 
 * Tamaños reducidos para no competir con el carrito (z-index por debajo del Sheet del carrito):
 * - Desktop (≥1024px): 80x80px
 * - Tablet/Default: 64x64px  
 * - Mobile (<768px): 50x50px
 * 
 * El botón de WhatsApp se posiciona ENCIMA del conejito (chat).
 */
export function WhatsAppFloat() {
  return (
    <>
      {/* Estilos CSS para coincidir con las dimensiones del chat widget */}
      <style jsx>{`
        .whatsapp-float-btn {
          position: fixed;
          right: 20px;
          z-index: 999000;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: #25D366;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
          text-decoration: none;
          
          width: 64px;
          height: 64px;
          bottom: 94px; /* conejito 64px + 20 + 10 gap */
        }
        
        .whatsapp-float-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          background-color: #20BD5A;
        }
        
        .whatsapp-float-btn svg {
          width: 36px;
          height: 36px;
          fill: white;
        }
        
        @media (min-width: 1024px) {
          .whatsapp-float-btn {
            width: 80px;
            height: 80px;
            bottom: 100px;
          }
          
          .whatsapp-float-btn svg {
            width: 44px;
            height: 44px;
          }
        }
        
        @media (max-width: 767px) {
          .whatsapp-float-btn {
            width: 50px;
            height: 50px;
            right: 15px;
            bottom: 73px; /* conejito 50px + 15 + 8 gap */
          }
          
          .whatsapp-float-btn svg {
            width: 28px;
            height: 28px;
          }
        }
        
        .whatsapp-tooltip {
          position: absolute;
          right: 100%;
          margin-right: 12px;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-size: 14px;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        
        .whatsapp-float-btn:hover .whatsapp-tooltip {
          opacity: 1;
        }
        
        @media (max-width: 767px) {
          .whatsapp-tooltip {
            display: none;
          }
        }
      `}</style>
      
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Contáctanos por WhatsApp"
      >
        {/* Icono de WhatsApp SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
        >
          <path d="M16.002 3C8.833 3 3 8.833 3 16.002c0 2.292.6 4.533 1.737 6.504L3 29l6.695-1.756A12.94 12.94 0 0 0 16.002 29C23.169 29 29 23.169 29 16.002 29 8.833 23.169 3 16.002 3zm0 23.545a10.5 10.5 0 0 1-5.354-1.463l-.384-.228-3.977 1.043 1.062-3.882-.25-.398a10.46 10.46 0 0 1-1.606-5.615c0-5.8 4.72-10.52 10.52-10.52 5.799 0 10.52 4.72 10.52 10.52 0 5.8-4.72 10.52-10.52 10.52v.023zm5.77-7.882c-.316-.158-1.872-.924-2.162-1.03-.29-.105-.502-.158-.713.158-.21.316-.818 1.03-.999 1.24-.184.21-.368.237-.684.079-.316-.158-1.334-.492-2.54-1.569-.94-.838-1.573-1.872-1.757-2.188-.184-.316-.02-.486.138-.644.141-.141.316-.368.474-.553.158-.184.21-.316.316-.526.105-.21.052-.395-.026-.553-.079-.158-.713-1.716-.977-2.35-.257-.617-.52-.533-.713-.543-.184-.01-.394-.012-.605-.012-.21 0-.553.079-.842.395-.29.316-1.108 1.082-1.108 2.64 0 1.556 1.134 3.06 1.293 3.27.158.211 2.232 3.41 5.41 4.782.756.326 1.346.52 1.806.667.759.241 1.45.207 1.996.125.61-.09 1.872-.765 2.135-1.504.263-.738.263-1.372.184-1.504-.079-.131-.29-.21-.605-.368z"/>
        </svg>
        
        {/* Tooltip en hover */}
        <span className="whatsapp-tooltip">
          Escríbenos por WhatsApp
        </span>
      </a>
    </>
  )
}