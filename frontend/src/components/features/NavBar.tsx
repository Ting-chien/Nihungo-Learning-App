import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const DROPDOWN_ITEMS = [
  { label: '五十音總表', to: '/gojuuon' },
  { label: '小測驗', to: '/gojuuon/quiz' },
  { label: '測驗紀錄', to: '/gojuuon/history' },
]

const NavBar = () => {
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isGojuuonActive = pathname.startsWith('/gojuuon')

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="max-w-3xl mx-auto flex items-center gap-4 sm:gap-8 px-4 sm:px-8 h-14">
        <Link to="/" className="text-lg font-bold text-foreground shrink-0">
          大家來學日本語
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={`flex items-center gap-1 px-1 py-1 text-sm font-medium transition-colors ${
                isGojuuonActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              五十音
              <svg
                className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-background border border-border rounded-md shadow-md py-1">
                {DROPDOWN_ITEMS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="sm:hidden ml-auto p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="開啟選單"
        >
          {mobileOpen ? (
            // X icon
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-0.5">
          <span className={`px-3 py-1.5 text-sm font-semibold ${isGojuuonActive ? 'text-foreground' : 'text-muted-foreground'}`}>
            五十音
          </span>
          <div className="ml-3 border-l border-border pl-3 flex flex-col gap-0.5">
            {DROPDOWN_ITEMS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === to
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
