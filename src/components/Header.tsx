// src/components/Header.tsx
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const Header: FC = () => {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'Our Story' },
    { path: '/products', label: 'Products' },
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
        {navLinks.map(({ path, label }) => (
          <a
            key={path}
            href={path}
            className={`nav-link ${currentPath === path ? 'nav-link-active' : ''}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
