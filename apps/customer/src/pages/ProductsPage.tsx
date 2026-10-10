import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, RefreshCw, PackageOpen, ChevronRight, Search as SearchIcon } from 'lucide-react';
import type { Category, Product } from '../types';
import { api } from '../lib/api';
import {
  STATIC_CATEGORIES,
  findCategoryBySlugOrId,
  getProductsForCategory,
  getAllMergedProducts,
  normalizeCategorySlug,
  type CategoryWithSeo,
} from '../lib/catalogData';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawCategoryParam = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const isSearching = Boolean(currentSearch && currentSearch.trim());

  // Load backend categories and products
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const catData = await api.categories.getAll();
        setApiCategories(catData || []);
      } catch (err: any) {
        console.warn('API categories load failed, using static catalog:', err);
      }

      try {
        const prodData = await api.products.getAll();
        setApiProducts(prodData || []);
      } catch (err: any) {
        console.warn('API products load failed, using static catalog:', err);
        setError('Could not connect to backend server. Showing offline catalog.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // All combined products from database and static catalog
  const allProducts = useMemo(() => {
    return getAllMergedProducts(apiProducts);
  }, [apiProducts]);

  // Search category distribution counts when searching
  const searchCategoryCounts = useMemo(() => {
    if (!isSearching) return [];

    const q = currentSearch.toLowerCase().trim();
    const queryWords = q.split(/\s+/).filter(Boolean);

    const matches = allProducts.filter((p) => {
      const targetText = `${p.name} ${p.description || ''} ${p.unit || ''} ${p.category?.name || ''} ${p.category?.slug || ''}`.toLowerCase();
      return queryWords.every((word) => targetText.includes(word));
    });

    const catCounts = new Map<string, { slug: string; name: string; count: number }>();

    for (const prod of matches) {
      const catSlug = prod.category?.slug
        ? normalizeCategorySlug(prod.category.slug)
        : normalizeCategorySlug(prod.categoryId || '');

      const catInfo = STATIC_CATEGORIES.find((c) => c.slug === catSlug) || {
        slug: catSlug || 'other',
        name: prod.category?.name || 'Other',
      };

      const existing = catCounts.get(catInfo.slug);
      if (existing) {
        existing.count++;
      } else {
        catCounts.set(catInfo.slug, {
          slug: catInfo.slug,
          name: catInfo.name,
          count: 1,
        });
      }
    }

    return Array.from(catCounts.values());
  }, [allProducts, isSearching, currentSearch]);

  // Resolved products, category, and match counts
  const { products, activeCategory, totalSearchMatches } = useMemo(() => {
    // Mode 1: Search query active
    if (isSearching) {
      const q = currentSearch.toLowerCase().trim();
      const queryWords = q.split(/\s+/).filter(Boolean);

      // Search across the entire product catalog
      const allMatches = allProducts.filter((p) => {
        const targetText = `${p.name} ${p.description || ''} ${p.unit || ''} ${p.category?.name || ''} ${p.category?.slug || ''}`.toLowerCase();
        return queryWords.every((word) => targetText.includes(word));
      });

      // Filter by category if user clicked a specific category pill while searching
      let filtered = allMatches;
      let matchedCategory: CategoryWithSeo | undefined = undefined;

      if (rawCategoryParam && rawCategoryParam !== 'all') {
        const normCat = normalizeCategorySlug(rawCategoryParam);
        matchedCategory = findCategoryBySlugOrId(rawCategoryParam, apiCategories);
        filtered = allMatches.filter((p) => {
          const pCatSlug = p.category?.slug ? normalizeCategorySlug(p.category.slug) : '';
          const pCatId = p.categoryId || p.category?.id;
          return (
            pCatId === rawCategoryParam ||
            pCatSlug === normCat ||
            (p.categoryId && normalizeCategorySlug(p.categoryId) === normCat)
          );
        });
      }

      return {
        products: filtered,
        activeCategory: matchedCategory,
        totalSearchMatches: allMatches.length,
      };
    }

    // Mode 2: Standard category browsing
    const activeCat = rawCategoryParam
      ? findCategoryBySlugOrId(rawCategoryParam, apiCategories) || STATIC_CATEGORIES[0]
      : STATIC_CATEGORIES.find((c) => c.slug === 'dairy-bread-eggs') || STATIC_CATEGORIES[0];

    const result = getProductsForCategory(
      activeCat.slug || activeCat.id,
      apiProducts
    );

    return {
      products: result.products,
      activeCategory: result.category || activeCat,
      totalSearchMatches: result.products.length,
    };
  }, [allProducts, apiProducts, apiCategories, isSearching, currentSearch, rawCategoryParam]);

  const handleSelectCategory = (catSlug: string) => {
    const nextParams = new URLSearchParams();
    if (catSlug && catSlug !== 'all') {
      nextParams.set('category', catSlug);
    }
    if (currentSearch) {
      nextParams.set('search', currentSearch);
    }
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('search');
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const seoTitle = isSearching
    ? `Search results for "${currentSearch}" | Blinkit`
    : activeCategory?.seoTitle || `${activeCategory?.name || 'Groceries'} Online`;

  const seoDescription = isSearching
    ? `Browse all items matching "${currentSearch}" delivered in 10-27 minutes at the lowest online prices from Blinkit.`
    : activeCategory?.seoDescription ||
      `Order authentic fresh ${activeCategory?.name} delivered at lightning speed in 10-27 minutes at the lowest online prices from Blinkit.`;

  return (
    <div className="page-wrapper" style={{ paddingBottom: '3rem' }}>
      {/* 1. Category Switcher Rail & Breadcrumbs */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          {/* Breadcrumb path */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Link to="/" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
              Home
            </Link>
            {isSearching ? (
              <>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--color-text-secondary)' }}>Search</span>
                <ChevronRight size={14} />
                <span style={{ fontWeight: 700, color: 'var(--color-brand-green)' }}>
                  &ldquo;{currentSearch}&rdquo;
                </span>
                {activeCategory && (
                  <>
                    <ChevronRight size={14} />
                    <span style={{ fontWeight: 600, color: '#374151' }}>
                      {activeCategory.name}
                    </span>
                  </>
                )}
              </>
            ) : (
              <>
                <ChevronRight size={14} />
                <span style={{ fontWeight: 700, color: 'var(--color-brand-green)' }}>
                  {activeCategory?.name}
                </span>
              </>
            )}
          </div>

          {(currentSearch || rawCategoryParam) && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-danger)',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'var(--color-danger-light)',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <X size={13} /> Reset view
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Rail */}
        <div className="category-filter-rail" style={{ marginBottom: '0.85rem' }}>
          {isSearching ? (
            <>
              <button
                type="button"
                className={`filter-pill ${!rawCategoryParam || rawCategoryParam === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('all')}
                id="pill-search-all"
              >
                All Results ({totalSearchMatches})
              </button>
              {searchCategoryCounts.map((sc) => {
                const isSelected =
                  rawCategoryParam &&
                  normalizeCategorySlug(sc.slug) === normalizeCategorySlug(rawCategoryParam);
                return (
                  <button
                    key={sc.slug}
                    type="button"
                    className={`filter-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(sc.slug)}
                    id={`pill-${sc.slug}`}
                  >
                    {sc.name} ({sc.count})
                  </button>
                );
              })}
            </>
          ) : (
            STATIC_CATEGORIES.map((cat) => {
              const isSelected =
                activeCategory &&
                normalizeCategorySlug(cat.slug) === normalizeCategorySlug(activeCategory.slug);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`filter-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(cat.slug)}
                  id={`pill-${cat.slug}`}
                >
                  {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Top Header: Category / Search Title & Count */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#111827',
            margin: 0,
          }}
        >
          {isSearching ? `Search results for "${currentSearch}"` : activeCategory?.name}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.25rem', margin: 0 }}>
          {products.length} {products.length === 1 ? 'item' : 'items'} available for 10-minute delivery
        </p>
      </div>

      {/* Error state if any */}
      {error && (
        <div className="alert-box alert-danger">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
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

      {/* 3. Full-Width Catalog View */}
      <div className="catalog-wrapper-full">
        {isLoading ? (
          <div className="catalog-products-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={isSearching ? <SearchIcon size={40} /> : <PackageOpen size={40} />}
            title={
              isSearching
                ? `No products found for "${currentSearch}"`
                : `No products in ${activeCategory?.name || 'this category'}`
            }
            description={
              isSearching
                ? 'Check for spelling mistakes, or try searching for items like "milk", "bread", "chips", or "dettol".'
                : 'We are replenishing fresh inventory for this category. Please check back shortly.'
            }
            actionText={isSearching ? 'Clear Search' : 'View Other Categories'}
            onActionClick={isSearching ? handleClearSearch : handleClearFilters}
          />
        ) : (
          <div className="catalog-products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Informative / SEO Description Section */}
        <div className="catalog-seo-section">
          <h3 className="catalog-seo-title">{seoTitle}</h3>
          <p className="catalog-seo-text">{seoDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
