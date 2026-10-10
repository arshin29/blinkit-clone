import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import type { Category, Product } from '../types';
import { api } from '../lib/api';
import { STATIC_CATEGORIES, normalizeCategorySlug, getTrendingProducts } from '../lib/catalogData';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCardSkeleton } from '../components/common/LoadingSkeleton';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>(getTrendingProducts());
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setError(null);
    setIsLoadingCategories(true);
    try {
      const catData = await api.categories.getAll();
      if (catData && catData.length > 0) {
        // Merge API category IDs with static categories preserving order (Paan Corner at the end)
        const merged = STATIC_CATEGORIES.map((sc) => {
          const match = catData.find(
            (c) =>
              c.slug === sc.slug ||
              normalizeCategorySlug(c.slug) === sc.slug ||
              c.name.toLowerCase() === sc.name.toLowerCase()
          );
          return match
            ? { ...sc, id: match.id, slug: sc.slug }
            : sc;
        });
        setCategories(merged);
      }
    } catch (err: any) {
      console.warn('Using offline categories catalog:', err);
    } finally {
      setIsLoadingCategories(false);
    }

    try {
      const prodData = await api.products.getAll();
      if (prodData && prodData.length > 0) {
        setTrendingProducts(getTrendingProducts(prodData));
      }
    } catch (err: any) {
      console.warn('Using offline trending products catalog:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page-wrapper">
      {/* Error Alert if any */}
      {error && (
        <div className="alert-box alert-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadData}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              color: 'var(--color-danger)',
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* 1. Category Discovery Section matching First Reference Image (Paan Corner is 20th and last) */}
      <section className="categories-container" aria-label="Shop by category">
        <div className="section-header" style={{ marginBottom: '0.85rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>
              Shop by Category
            </h2>
          </div>
          <Link to="/products" className="section-link">
            See all <ArrowRight size={15} />
          </Link>
        </div>

        {isLoadingCategories ? (
          <div className="categories-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/products?category=${encodeURIComponent(cat.slug || cat.id)}`}
                className="category-card"
                id={`cat-card-${cat.slug || cat.id}`}
                title={cat.name}
              >
                <div className="category-img-wrapper">
                  <img
                    src={cat.image || `/categories/${cat.slug}.png`}
                    alt={cat.name}
                    className="category-img"
                    loading="lazy"
                  />
                </div>
                <span className="category-card-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 2. Trending Products Section (Curated from Category List) */}
      <section className="products-section" aria-label="Trending products" style={{ marginTop: '2.5rem' }}>
        <div className="section-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Trending Products
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#6b7280' }}>
              Most loved essentials picked from our categories &bull; Delivered in 27 minutes
            </p>
          </div>
          <Link to="/products" className="section-link">
            See all ({trendingProducts.length}) <ArrowRight size={15} />
          </Link>
        </div>

        <div className="products-grid">
          {trendingProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
