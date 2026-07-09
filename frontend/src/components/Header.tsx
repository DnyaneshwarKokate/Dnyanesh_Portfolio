'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Code } from 'lucide-react';
import styles from './Header.module.css';
import { API_BASE_URL } from '@/config';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleDownloadResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Code size={28} color="#06b6d4" />
          <span>
            Dnyaneshwar<span className={styles.logoDot}>.Dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navLink} ${
                pathname === link.path ? styles.activeLink : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          

          
          <button onClick={handleDownloadResume} className={styles.resumeBtn}>
            Resume
          </button>
        </nav>

        {/* Mobile Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>


          {/* Mobile Nav Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.menuBtn}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`${styles.mobileNav} ${isOpen ? styles.isOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navLink} ${
                pathname === link.path ? styles.activeLink : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              handleDownloadResume();
            }}
            className={styles.resumeBtn}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Resume
          </button>
        </div>
      </div>
    </header>
  );
}
