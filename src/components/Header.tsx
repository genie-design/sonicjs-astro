// src/components/Header.tsx
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const Header: FC<{ user?: null | string }> = ({ user }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Our Story' },
    {
      path: '/products',
      label: 'Products',
      subLinks: [
        { path: '/products/peanut-butter', label: 'Peanut Butter' },
        { path: '/products/apple-carrot', label: 'Apple Carrot' },
        {
          path: '/products/peanut-butter-blueberry',
          label: 'Peanut Butter Blueberry'
        },
        { path: '/products/pumpkin', label: 'Pumpkin' }
      ]
    },
    { path: '/purchase', label: 'Purchase' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/made', label: "How They're Made" },
    { path: '/blog', label: 'Blog' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
    !user ?
      {
        path: '/login',
        label: 'Account',
        subLinks: [
          { path: '/login', label: 'Login' },
          { path: '/register', label: 'Register' }
        ]
      }
    : {
        path: '/account',
        label: `Hi ${user}!`,
        subLinks: [
          { path: '/account', label: 'Account' },
          { path: '/logout', label: 'Logout' }
        ]
      }
  ];

  return (
    <header className='main-header'>
      <div className='top-nav'>
        <div className='nav-start'>
          <button
            className='mobile-menu-button'
            onClick={toggleMobileMenu}
            aria-label='Toggle mobile menu'
          >
            <span
              className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
            ></span>
          </button>
        </div>
        <div className='brand'>
          <img
            src='/images/heart.svg'
            className='heart-icon'
            alt='Heart icon'
          />
          <span className='brand-name'>BROWN DOG BISCUITS</span>
          <img
            src='/images/heart.svg'
            className='heart-icon'
            alt='Heart icon'
          />
        </div>
        <div className='nav-end'></div>
      </div>
      <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        {navLinks.map(({ path, label, subLinks }) => (
          <div key={path} className='nav-item'>
            <a
              href={path}
              className={`nav-link ${
                (
                  path === '/' ?
                    !currentPath || currentPath === path
                  : currentPath.startsWith(path)
                ) ?
                  'nav-link-active'
                : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label} {subLinks && <span>&#9662;</span>}
            </a>
            {subLinks && (
              <div className='dropdown'>
                {subLinks.map(({ path: subPath, label: subLabel }) => (
                  <a
                    key={subPath}
                    href={subPath}
                    className='dropdown-link'
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {subLabel}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
