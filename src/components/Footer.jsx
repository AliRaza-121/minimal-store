import Link from 'next/link'

const footerLinks = {
  Shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Men', href: '/shop?category=Men' },
    { name: 'Women', href: '/shop?category=Women' },
    { name: 'Accessories', href: '/shop?category=Accessories' },
    { name: 'Home', href: '/shop?category=Home' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 bg-gold rotate-45" />
              <span className="text-lg tracking-[0.3em] font-light text-light">
                MINIMAL
              </span>
            </Link>
            <p className="text-muted text-sm font-light leading-relaxed max-w-xs">
              Curated essentials for the modern lifestyle. 
              Timeless design, exceptional quality, 
              and sustainable craftsmanship.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-5 mt-6">
              {['Instagram', 'Pinterest', 'Twitter'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-muted hover:text-gold tracking-widest uppercase font-light transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs text-light tracking-[0.2em] uppercase font-medium mb-5">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-light font-light transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted font-light">
            &copy; {new Date().getFullYear()} MINIMAL. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted hover:text-light font-light transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted hover:text-light font-light transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}