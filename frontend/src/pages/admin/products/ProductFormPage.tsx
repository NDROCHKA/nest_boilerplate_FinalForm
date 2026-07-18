import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { productAdminApi } from '../../../api/product-admin.api';
import { categoryAdminApi } from '../../../api/category-admin.api';
import { Category } from '../../../types/category.types';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Arrays handled as strings/dynamic inputs
  const [sizesStr, setSizesStr] = useState('S, M, L, XL');
  const [colorsStr, setColorsStr] = useState('White, Black');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAdminApi.getAll({ limit: 100 });
        setCategories(res.data);
        if (res.data.length > 0 && !isEdit) {
          setCategoryId(String(res.data[0].id));
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    loadCategories();
  }, [isEdit]);

  // Load product if editing
  useEffect(() => {
    if (!isEdit) return;

    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const prod = await productAdminApi.getById(Number(id));
        setName(prod.name);
        setDescription(prod.description || '');
        setPrice(String(prod.price));
        setDiscountPercent(String(prod.discountPercent || '0'));
        setStock(String(prod.stock));
        setCategoryId(String(prod.categoryId));
        setIsActive(prod.isActive);

        setSizesStr(prod.sizes.join(', '));
        setColorsStr(prod.colors.join(', '));

        if (prod.images && prod.images.length > 0) {
          const sortedUrls = [...prod.images]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => img.url);
          setImageUrls(sortedUrls);
        } else {
          setImageUrls(['']);
        }
      } catch (e: any) {
        console.error(e);
        showToast(e.message || 'Failed to load product details.', 'error');
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!name.trim()) tempErrors.name = 'Product name is required';
    if (!price || Number(price) <= 0) tempErrors.price = 'Price must be greater than 0';
    if (Number(discountPercent) < 0 || Number(discountPercent) > 100) {
      tempErrors.discountPercent = 'Discount must be between 0 and 100';
    }
    if (!stock || Number(stock) < 0) tempErrors.stock = 'Stock cannot be negative';
    if (!categoryId) tempErrors.categoryId = 'Category selection is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const addImageUrlField = () => {
    setImageUrls((prev) => [...prev, '']);
  };

  const removeImageUrlField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Split arrays by comma and trim items
      const sizes = sizesStr.split(',').map((s) => s.trim()).filter(Boolean);
      const colors = colorsStr.split(',').map((c) => c.trim()).filter(Boolean);
      const finalImageUrls = imageUrls.map((url) => url.trim()).filter(Boolean);

      const basePayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        discountPercent: parseFloat(discountPercent) || undefined,
        stock: parseInt(stock, 10),
        categoryId: parseInt(categoryId, 10),
        sizes,
        colors,
        imageUrls: finalImageUrls.length > 0 ? finalImageUrls : undefined,
        isActive,
      };

      if (isEdit) {
        // For updates, the backend accepts null or 0 for discountPercent to clear discounts
        const updatePayload = {
          ...basePayload,
          discountPercent: basePayload.discountPercent === undefined ? null : basePayload.discountPercent,
        };
        await productAdminApi.update(Number(id), updatePayload);
        showToast('Product updated successfully', 'success');
      } else {
        await productAdminApi.create(basePayload);
        showToast('Product created successfully', 'success');
      }
      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Action failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <Link
          to="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-secondary)',
            fontSize: '0.875rem',
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p>{isEdit ? `Modifying Product #${id}` : 'Create a new listing in catalog directory'}</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Main Info */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3>Product Information</h3>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

            <Input
              label="Product Name"
              placeholder="e.g. Vintage heavyweight hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              disabled={isSubmitting}
            />

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Item sizing specifications and material qualities details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                style={{
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={errors.price}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
              <Input
                label="Discount (%)"
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                error={errors.discountPercent}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input
                label="Stock Level"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                error={errors.stock}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
              <Select
                label="Category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                error={errors.categoryId}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                id="active-checkbox"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
              />
              <label htmlFor="active-checkbox" style={{ margin: 0, cursor: 'pointer' }}>
                Visible in the public storefront catalog
              </label>
            </div>
          </div>

          {/* Options & Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Options */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3>Attributes / Options</h3>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

              <Input
                label="Sizes (comma separated)"
                placeholder="S, M, L, XL"
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                disabled={isSubmitting}
              />

              <Input
                label="Colors (comma separated)"
                placeholder="Black, White, Navy"
                value={colorsStr}
                onChange={(e) => setColorsStr(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Images */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Product Images</h3>
                <Button variant="secondary" onClick={addImageUrlField} disabled={isSubmitting} style={{ padding: '0.25rem 0.5rem' }}>
                  <Plus size={16} />
                </Button>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {imageUrls.map((url, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Input
                      placeholder="https://example.com/product-image.jpg"
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      disabled={isSubmitting}
                      containerClassName="flex-1"
                      style={{ margin: 0 }}
                    />
                    {imageUrls.length > 1 && (
                      <Button
                        variant="text"
                        onClick={() => removeImageUrlField(index)}
                        style={{ color: 'var(--color-danger)', padding: '0.5rem' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Save Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Link to="/admin/products">
                <Button variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isSubmitting} style={{ minWidth: '150px' }} onClick={handleSubmit}>
                <Check size={16} />
                Save Product
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
