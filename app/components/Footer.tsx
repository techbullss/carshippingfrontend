export default function Footer() {
  return (
   <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8 relative">
  {/* Decorative top border */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400"></div>
  
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
          {['facebook', 'twitter', 'instagram'].map((social, index) => (
            <a 
              key={index}
              href="#" 
              className="bg-gray-800 p-3 rounded-full text-white hover:bg-sky-500 hover:scale-110 transition-all duration-300"
              aria-label={`Follow us on ${social}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {/* Add your social icons here */}
              </svg>
            </a>
          ))}
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
