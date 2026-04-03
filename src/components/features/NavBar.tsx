import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const DROPDOWN_ITEMS = [
  { label: '五十音總表', to: '/gojuuon' },
  { label: '小測驗', to: '/gojuuon/quiz' },
]

const NavBar = () => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isGojuuonActive = pathname.startsWith('/gojuuon')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="max-w-3xl mx-auto flex items-center gap-8 px-8 h-14">
        <Link to="/" className="text-lg font-bold text-foreground shrink-0">
          大家來學日本語
        </Link>

        <nav className="flex items-center gap-1">
          {/* 五十音 dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isGojuuonActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              五十音
              <svg
                className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-background border border-border rounded-md shadow-md py-1">
                {DROPDOWN_ITEMS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === to
                        ? 'bg-secondary text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default NavBar
