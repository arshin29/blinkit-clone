import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import type { Category, CreateProductInput, Product } from '../types';
import { StockBadge } from '../components/common/Badge';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
  AlertCircle,
  Package,
} from 'lucide-react';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        api.products.getAll(),
        api.categories.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      setError(err?.message || 'Failed to load products inventory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side filtering for ultra-fast responsive typing
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        !selectedCategory || item.categoryId === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: CreateProductInput) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const updated = await api.products.update(editingProduct.id, formData);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
        );
        success(`Product "${updated.name}" updated successfully.`);
      } else {
        const created = await api.products.create(formData);
        // Find matching category object
        const cat = categories.find((c) => c.id === created.categoryId);
        setProducts((prev) => [{ ...created, category: cat }, ...prev]);
        success(`Product "${created.name}" created successfully.`);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toastError(err?.message || 'Failed to save product. Please verify all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.products.delete(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      success(`Product "${productToDelete.name}" removed successfully.`);
      setProductToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top action row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Products Inventory ({filteredProducts.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Manage catalog items, pricing, packaging units, and dark store stock
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchData}
            className="btn btn-outline btn-sm"
            title="Refresh product list"
          >
            <RefreshCw size={14} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={fetchData} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      )}

      {/* Search and Category Filter Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content Table / Loading / Empty */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={searchTerm || selectedCategory ? 'No matching products' : 'No products found'}
          subtitle={
            searchTerm || selectedCategory
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Start by adding your first grocery product to the catalog.'
          }
          actionText={searchTerm || selectedCategory ? 'Clear Filters' : 'Add First Product'}
          onAction={
            searchTerm || selectedCategory
              ? () => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }
              : handleOpenAdd
          }
          icon={<Package size={32} />}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Image</th>
                <th>Product Name & Unit</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Price / MRP</th>
                <th>Stock Level</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border-subtle)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/100x100?text=Pack';
                          }}
                        />
                      ) : (
                        <ImageIcon size={20} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Unit: {product.unit}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: 'var(--color-bg-subtle)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {product.category?.name || 'Unassigned'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-brand-green)' }}>
                      ₹{product.price.toFixed(2)}
                    </div>
                    {product.mrp && product.mrp > product.price && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          textDecoration: 'line-through',
                        }}
                      >
                        MRP ₹{product.mrp.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td>
                    <StockBadge stock={product.stock} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(product)}
                        className="btn-icon"
                        title="Edit product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(product)}
                        className="btn-icon"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        categories={categories}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Product"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
