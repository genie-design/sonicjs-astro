// src/components/Header.tsx
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const Header: FC = () => {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    console.log('bam:', window.location.pathname);
    setCurrentPath(window.location.pathname);
  }, []);

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
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <header className='main-header'>
      <div className='top-nav'>
        <div className='nav-start'></div>
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
      <nav className='main-nav'>
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
            >
              {label} {subLinks && <span>&#9662;</span>}
            </a>
            {subLinks && (
              <div className='dropdown'>
                {subLinks.map(({ path: subPath, label: subLabel }) => (
                  <a key={subPath} href={subPath} className='dropdown-link'>
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
