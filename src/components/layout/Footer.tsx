import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-heather-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Organic top accent */}
        <div className="mb-12">
          <svg
            viewBox="0 0 600 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-xs"
          >
            <path
              d="M0,4 C80,1 160,7 240,3 C320,0 400,6 480,4 C540,2 570,5 600,4"
              stroke="url(#footerGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="footerGrad" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6294b5" />
                <stop offset="100%" stopColor="#b5cfe2" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-semibold text-stone-900 tracking-widest block mb-4">
              NURT
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Tak jak nurt rzeki nieustannie zmienia swój bieg, tak twórczość
              prowadzi nas wciąż nowymi ścieżkami.
            </p>
          </div>

          {/* Warsztaty */}
          <div>
            <p className="section-label mb-4">Oferta</p>
            <ul className="space-y-2.5">
              {[
                { label: "Warsztaty", href: "/warsztaty" },
                { label: "Kursy Certyfikowane", href: "/kursy-certyfikowane" },
                { label: "Eventy i grupy", href: "/eventy" },
                { label: "Sklep", href: "/sklep" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-heather-700 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="section-label mb-4">Informacje</p>
            <ul className="space-y-2.5">
              {[
                { label: "O nas", href: "/informacje" },
                { label: "Grafik", href: "/grafik" },
                { label: "Kontakt", href: "/kontakt" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-heather-700 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-heather-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} NURT Warsztaty Artystyczne. Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-xs text-heather-400 font-serif italic">
            z nim wszystko płynie
          </p>
        </div>
      </div>
    </footer>
  );
}
