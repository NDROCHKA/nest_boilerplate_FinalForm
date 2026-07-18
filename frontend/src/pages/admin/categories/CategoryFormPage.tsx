import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, FolderTree } from 'lucide-react';
import { categoryAdminApi } from '../../../api/category-admin.api';
import { useToast } from '../../../context/ToastContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEdit) return;

    const loadCategory = async () => {
      setIsLoading(true);
      try {
        const cat = await categoryAdminApi.getById(Number(id));
        setName(cat.name);
        setDescription(cat.description || '');
        setImageUrl(cat.imageUrl || '');
      } catch (e: any) {
        console.error(e);
        showToast(e.message || 'Failed to load category information.', 'error');
        navigate('/admin/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id]);

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!name.trim()) tempErrors.name = 'Category name is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      };

      if (isEdit) {
        await categoryAdminApi.update(Number(id), payload);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryAdminApi.create(payload);
        showToast('Category created successfully', 'success');
      }
      navigate('/admin/categories');
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
          to="/admin/categories"
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
          Back to categories
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>
          {isEdit ? 'Edit Category' : 'Create Category'}
        </h1>
        <p>{isEdit ? `Modifying Category #${id}` : 'Scaffold a new department or section'}</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input
            label="Category Name"
            placeholder="e.g. Streetwear hoodies"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={isSubmitting}
          />

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="e.g. Handcrafted heavyweight fabric hoodies designed for styling..."
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

          <Input
            label="Image URL"
            placeholder="e.g. https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isSubmitting}
          />

          {/* Action Area */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/admin/categories">
              <Button variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting} style={{ minWidth: '150px' }}>
              <Check size={16} />
              {isEdit ? 'Update Category' : 'Save Category'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
