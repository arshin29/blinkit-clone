import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { ImageUpload } from '../common/ImageUpload';
import type { Category, CreateProductInput, Product } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  product?: Product | null;
  categories: Category[];
  isLoading?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('20');
  const [image, setImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setMrp(product.mrp.toString());
      setUnit(product.unit);
      setStock(product.stock.toString());
      setImage(product.image || '');
      setCategoryId(product.categoryId);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setMrp('');
      setUnit('');
      setStock('20');
      setImage('');
      setCategoryId(categories[0]?.id || '');
    }
    setErrors({});
  }, [product, categories, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Product name is required';
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Price must be a positive number';
    }

    const mrpNum = parseFloat(mrp);
    if (isNaN(mrpNum) || mrpNum <= 0) {
      errs.mrp = 'MRP must be a positive number';
    } else if (priceNum && mrpNum < priceNum) {
      errs.mrp = 'MRP should be greater than or equal to selling price';
    }

    if (!unit.trim()) {
      errs.unit = 'Unit is required (e.g., 500 g, 1 kg, 1 pc)';
    }

    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'Stock must be a non-negative integer';
    }

    if (!categoryId) {
      errs.categoryId = 'Category is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price),
      mrp: parseFloat(mrp),
      unit: unit.trim(),
      stock: parseInt(stock, 10),
      image: image.trim() || undefined,
      categoryId,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Amul Taaza Fresh Toned Milk"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-control filter-select"
                style={{ width: '100%' }}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="form-error">{errors.categoryId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Unit / Packaging *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 500 ml, 1 kg, Pack of 2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              {errors.unit && <span className="form-error">{errors.unit}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="27.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && <span className="form-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">MRP (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="30.00"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
              {errors.mrp && <span className="form-error">{errors.mrp}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity *</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-control"
                placeholder="20"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
              {errors.stock && <span className="form-error">{errors.stock}</span>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUpload
                value={image}
                onChange={setImage}
                folder="blinkit/products"
                label="Product Image"
                placeholder="https://images.unsplash.com/... or upload directly to Cloudinary"
                searchQuery={name}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-control"
                placeholder="Short description of the product and its key details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
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
            {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
