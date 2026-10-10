import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../lib/api';
import type { Category, CreateCategoryInput } from '../types';
import { TableSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CategoryFormModal } from '../components/categories/CategoryFormModal';
import { useToast } from '../context/ToastContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Image as ImageIcon,
  RefreshCw,
  AlertCircle,
  Package,
} from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.categories.getAll();
      setCategories(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData: CreateCategoryInput) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await api.categories.update(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
        );
        success(`Category "${updated.name}" updated successfully.`);
      } else {
        const created = await api.categories.create(formData);
        setCategories((prev) => [created, ...prev]);
        success(`Category "${created.name}" created successfully.`);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toastError(err?.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await api.categories.delete(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      success(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
    } catch (err: any) {
      toastError(err?.message || 'Failed to delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
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
            Product Categories ({filteredCategories.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Organize the dark store catalog and navigation taxonomy
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchCategories}
            className="btn btn-outline btn-sm"
            title="Refresh category list"
          >
            <RefreshCw size={14} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button type="button" onClick={fetchCategories} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title={searchTerm ? 'No matching categories' : 'No categories found'}
          subtitle={
            searchTerm
              ? 'Try searching with a different term.'
              : 'Add your first category to start organizing inventory.'
          }
          actionText={searchTerm ? 'Clear Search' : 'Add Category'}
          onAction={searchTerm ? () => setSearchTerm('') : handleOpenAdd}
          icon={<Layers size={32} />}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Icon</th>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Product Count</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--color-border-subtle)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/80x80?text=Cat';
                          }}
                        />
                      ) : (
                        <ImageIcon size={18} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {category.name}
                    </div>
                  </td>
                  <td>
                    <code
                      style={{
                        fontSize: '12px',
                        backgroundColor: 'var(--color-bg-subtle)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {category.slug}
                    </code>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 500,
                      }}
                    >
                      <Package size={14} color="var(--color-brand-green)" />
                      {category._count?.products ?? '—'} products
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(category)}
                        className="btn-icon"
                        title="Edit category"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCategoryToDelete(category)}
                        className="btn-icon"
                        style={{ color: 'var(--color-danger)' }}
                        title="Delete category"
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

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        category={editingCategory}
        existingCategories={categories}
        isLoading={isSubmitting}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Any linked products may also be affected.`}
        confirmLabel="Delete Category"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
};
