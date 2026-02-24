export default function Footer() {
  return (
   <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 relative">
  {/* Decorative top border */}
  
  <div className="container mx-auto px-4 lg:px-8">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      
      {/* Company Info - Enhanced */}
      <div className="mb-6 transform transition-transform duration-300 hover:translate-y-[-4px]">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-4">
          F-carshipping
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Your trusted partner in nationwide vehicle transportation. 
          Safe, reliable, and professional service every time.
        </p>
        <div className="flex space-x-4">
  {/* Facebook */}
  <a 
    href="#" 
    className="bg-gray-800 p-3 rounded-full text-white hover:bg-[#1877f2] hover:scale-110 transition-all duration-300"
    aria-label="Follow us on Facebook"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  </a>

  {/* Twitter/X */}
  <a 
    href="#" 
    className="bg-gray-800 p-3 rounded-full text-white hover:bg-black hover:scale-110 transition-all duration-300"
    aria-label="Follow us on X (Twitter)"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  </a>

  {/* Instagram */}
  <a 
    href="#" 
    className="bg-gray-800 p-3 rounded-full text-white hover:bg-[#e4405f] hover:scale-110 transition-all duration-300"
    aria-label="Follow us on Instagram"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
    </svg>
  </a>

  {/* TikTok */}
  <a 
    href="#" 
    className="bg-gray-800 p-3 rounded-full text-white hover:bg-[#000000] hover:scale-110 transition-all duration-300"
    aria-label="Follow us on TikTok"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.88-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  </a>
</div>
      </div>

      {/* Quick Links - Enhanced */}
      <div className="mb-6 lg:ml-12">
        <h4 className="text-lg font-semibold text-sky-400 mb-6 relative inline-block">
          Quick Links
          <span className="absolute bottom-[-8px] left-0 w-12 h-0.5 bg-gradient-to-r from-sky-400 to-transparent"></span>
        </h4>
        <ul className="space-y-3">
          {[
            { name: 'Home', path: '/' },
            { name: 'Sell With Us', path: '/sell' },
            { name: 'About Us', path: '/about' },
            { name: 'Contact Us', path: '/contact' },
            { name: 'Login', path: '/login' }
          ].map((link) => (
            <li key={link.name}>
              <a 
                href={link.path} 
                className="text-gray-300 hover:text-sky-400 transition-all duration-300 flex items-center group"
              >
                <span className="w-0 group-hover:w-2 h-0.5 bg-sky-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info - Enhanced */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-sky-400 mb-6 relative inline-block">
          Get In Touch
          <span className="absolute bottom-[-8px] left-0 w-12 h-0.5 bg-gradient-to-r from-sky-400 to-transparent"></span>
        </h4>
        <ul className="space-y-4">
          <li className="flex items-start group hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-300">
            <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-sky-500/20 transition-colors duration-300">
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm leading-relaxed">
              2010, Estuary House, 196 Ballards Road<br />
              Dagenham, RM10 9AB, United Kingdom
            </span>
          </li>
          
          <li className="flex items-center group hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-300">
            <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-sky-500/20 transition-colors duration-300">
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-gray-300 font-medium">+44 7398 145581</span>
          </li>
          
          <li className="flex items-center group hover:bg-gray-800/50 p-2 rounded-lg transition-all duration-300">
            <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-sky-500/20 transition-colors duration-300">
              <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-300 hover:text-sky-400 transition-colors duration-300">
              info@f-carshipping.com
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* Business Hours Badge - Optional Addition */}
    <div className="mt-12 p-4 bg-gray-800/50 rounded-xl border border-gray-700 inline-block">
      <p className="text-sm text-gray-300">
        <span className="text-sky-400 font-semibold">Mon - Fri:</span> 9:00 AM - 6:00 PM
        <span className="mx-3 text-gray-600">|</span>
        <span className="text-sky-400 font-semibold">Sat:</span> 10:00 AM - 4:00 PM
        <span className="mx-3 text-gray-600">|</span>
        <span className="text-sky-400 font-semibold">Sun:</span> Closed
      </p>
    </div>

    {/* Copyright - Enhanced */}
    <div className="border-t border-gray-800 mt-12 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} F-carshipping. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-sky-400 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-sky-400 transition-colors duration-300">Terms of Service</a>
          <a href="#" className="hover:text-sky-400 transition-colors duration-300">Cookie Policy</a>
        </div>
      </div>
    </div>
  </div>
</footer>
  );
}
