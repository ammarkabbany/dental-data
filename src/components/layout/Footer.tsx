import { InstagramLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'
import Logo from '../logo'

const MainFooter = () => {
  return (
    <footer className="w-full border-t border-neutral-700 bg-neutral-900 text-gray-50 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Logo src="/old-fav.ico" className="size-14" />
                  <span className="text-xl font-bold text-primary dark:text-primary-foreground">DentaAuto</span>
                </div>
                <p className="text-sm text-gray-300">
                  Comprehensive dental lab management software designed by lab
                  professionals, for lab professionals.
                </p>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Product</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/#features"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#workflow"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Workflow
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#pricing"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  {/* Add other company links if available */}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-neutral-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} DentaAuto. All rights reserved.
              </p>
              <div className="flex items-center gap-5 mt-6 sm:mt-0">
                <Link
                  href="https://www.linkedin.com/company/crox-team/"
                  className="text-gray-400 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link
                  href="https://instagram.com/croxteamco/"
                  className="text-gray-400 hover:text-primary dark:hover:text-primary-foreground/80 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramLogoIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
  )
}

export default MainFooter