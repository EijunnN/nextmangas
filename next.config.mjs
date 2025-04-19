/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- Configuración de Imágenes Actualizada ---
  images: {
    // remotePatterns es la forma moderna y recomendada para permitir dominios externos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-b532e19f1f054fa18ac32a09305e6cc6.r2.dev',
        port: '', // Puerto vacío es estándar para https
        // Especifica la ruta base donde están tus imágenes para mayor seguridad
        // El doble asterisco (**) significa "cualquier cosa debajo de esta ruta"
        pathname: '/manga_images/**',
      },
      {
        protocol: 'https',
        hostname: 'otakuteca.com',
        port: '',
        

      }
      
    ],
    
  },
}

export default nextConfig;