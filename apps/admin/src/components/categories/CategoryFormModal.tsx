import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ImageUpload } from '../common/ImageUpload';
import type { Category, CreateCategoryInput } from '../../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  category?: Category | null;
  existingCategories?: Category[];
  isLoading?: boolean;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  existingCategories = [],
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setImage(category.image || '');
    } else {
      setName('');
      setSlug('');
      setImage('');
    }
    setErrors({});
  }, [category, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!category) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Category name is required';
    } else {
      // Check duplicate name
      const duplicate = existingCategories.find(
        (c) =>
          c.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          (!category || c.id !== category.id),
      );
      if (duplicate) {
        errs.name = 'A category with this name already exists';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      slug: slug.trim() || undefined,
      image: image.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dairy & Breakfast"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              autoFocus
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              className="form-control"
              placeholder="dairy-breakfast"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Unique URL identifier for the category
            </span>
          </div>

          <ImageUpload
            value={image}
            onChange={setImage}
            folder="blinkit/categories"
            label="Category Image"
            placeholder="https://images.unsplash.com/... or upload directly to Cloudinary"
            searchQuery={name}
          />
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
