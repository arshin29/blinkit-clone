import React from 'react';
import { Link } from 'react-router-dom';
import { STATIC_CATEGORIES } from '../../lib/catalogData';

interface LinkItem {
  label: string;
  to: string;
}

const USEFUL_LINKS_COL1: LinkItem[] = [
  { label: 'Blog', to: '/products' },
  { label: 'Privacy', to: '/products' },
  { label: 'Terms', to: '/products' },
  { label: 'FAQs', to: '/products' },
  { label: 'Security', to: '/products' },
  { label: 'Contact', to: '/products' },
];

const USEFUL_LINKS_COL2: LinkItem[] = [
  { label: 'Partner', to: '/products' },
  { label: 'Franchise', to: '/products' },
  { label: 'Seller', to: '/products' },
  { label: 'Warehouse', to: '/products' },
  { label: 'Deliver', to: '/products' },
  { label: 'Resources', to: '/products' },
];

const USEFUL_LINKS_COL3: LinkItem[] = [
  { label: 'Recipes', to: '/products' },
  { label: 'Bistro', to: '/products' },
  { label: 'District', to: '/products' },
  { label: 'Blinkit Ambulance', to: '/products' },
  { label: 'Feeding India', to: '/products' },
];

// Split the 20 official categories across 3 columns (7, 7, 6) with Paan Corner as the last item
const CATEGORIES_COL1 = STATIC_CATEGORIES.slice(0, 7);
const CATEGORIES_COL2 = STATIC_CATEGORIES.slice(7, 14);
const CATEGORIES_COL3 = STATIC_CATEGORIES.slice(14);

export const Footer: React.FC = () => {
  return (
    <footer className="blinkit-footer" aria-label="Footer Navigation">
      <div className="blinkit-footer-container">
        {/* Navigation Columns Section */}
        <div className="blinkit-footer-grid">
          {/* 1. Useful Links Block */}
          <div className="blinkit-footer-block">
            <h3 className="blinkit-footer-heading">Useful Links</h3>
            <div className="blinkit-links-subgrid three-cols">
              <ul className="blinkit-links-list">
                {USEFUL_LINKS_COL1.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="blinkit-links-list">
                {USEFUL_LINKS_COL2.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
              <ul className="blinkit-links-list">
                {USEFUL_LINKS_COL3.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2. Categories Block with "see all" (Synchronized with official category list) */}
          <div className="blinkit-footer-block">
            <div className="blinkit-heading-row">
              <h3 className="blinkit-footer-heading">Categories</h3>
              <Link to="/products" className="blinkit-see-all-link">
                see all
              </Link>
            </div>
            <div className="blinkit-links-subgrid three-cols">
              <ul className="blinkit-links-list">
                {CATEGORIES_COL1.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/products?category=${encodeURIComponent(cat.slug)}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="blinkit-links-list">
                {CATEGORIES_COL2.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/products?category=${encodeURIComponent(cat.slug)}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="blinkit-links-list">
                {CATEGORIES_COL3.map((cat) => (
                  <li key={cat.slug}>
                    <Link to={`/products?category=${encodeURIComponent(cat.slug)}`}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, App Badges, Social Media */}
        <div className="blinkit-footer-bottom">
          <div className="blinkit-copyright">
            &copy; Blink Commerce Private Limited, 2016-2026
          </div>

          <div className="blinkit-download-section">
            <span className="blinkit-download-text">Download App</span>
            <div className="blinkit-app-badges">
              {/* App Store Badge */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="blinkit-app-badge"
                title="Download on App Store"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.62 1.34-.56.65-.97 1.7-.84 2.73.99.08 2.01-.5 2.53-1.22z" />
                </svg>
                <div className="blinkit-badge-text">
                  <span className="badge-sub">Download on the</span>
                  <span className="badge-main">App Store</span>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                className="blinkit-app-badge"
                title="Get it on Google Play"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.986V2.8a2.38 2.38 0 0 1 .61-.986zm11.242 11.244l2.584 2.584-12.82 7.4a2.235 2.235 0 0 1-1.006.242l11.242-10.226zm2.584-2.116L20.65 12.5a1.14 1.14 0 0 1 0 1.98l-3.215 1.558-2.846-2.846 2.846-2.25zM4.615 1.76l12.82 7.4-2.584 2.584L3.609 1.518A2.235 2.235 0 0 1 4.615 1.76z" />
                </svg>
                <div className="blinkit-badge-text">
                  <span className="badge-sub">GET IT ON</span>
                  <span className="badge-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="blinkit-social-row">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="blinkit-social-circle" aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="blinkit-social-circle" aria-label="X">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="blinkit-social-circle" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="blinkit-social-circle" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* Threads */}
            <a href="https://threads.net" target="_blank" rel="noreferrer" className="blinkit-social-circle" aria-label="Threads">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.186 24C5.594 24 0 18.59 0 12.186 0 5.614 5.574 0 12.186 0 18.232 0 23.3 4.545 24 10.598h-3.327C20.015 6.368 16.48 3.273 12.186 3.273c-4.887 0-9.027 4.14-9.027 9.027 0 4.886 4.14 9.027 9.027 9.027 4.181 0 7.214-2.836 7.48-6.727H12.186v-3.273h10.99c.143 1.09.215 2.22.215 3.39 0 7.375-4.887 11.283-11.205 11.283z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="blinkit-disclaimer">
          &ldquo;Blinkit&rdquo; is owned &amp; managed by &ldquo;Blink Commerce Private Limited&rdquo; and is not related, linked or interconnected in whatsoever manner or nature, to &ldquo;GROFFR.COM&rdquo; which is a real estate services business operated by &ldquo;Redstone Consultancy Services Private Limited&rdquo;.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
