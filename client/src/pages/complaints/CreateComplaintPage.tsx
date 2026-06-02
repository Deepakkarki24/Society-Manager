import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '@/constants';
import toast from 'react-hot-toast';

interface ComplaintForm {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export const CreateComplaintPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<ComplaintForm>({
    defaultValues: { priority: 'medium', category: 'other' },
  });

  const onSubmit = async (data: ComplaintForm) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append('images', img));

    try {
      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Complaint submitted!');
      navigate('/complaints');
    } catch {
      toast.error('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Raise a Complaint</h1>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" {...register('title', { required: true })} />
          <Textarea label="Description" {...register('description', { required: true })} />
          <Select label="Category" options={COMPLAINT_CATEGORIES} {...register('category')} />
          <Select label="Priority" options={COMPLAINT_PRIORITIES} {...register('priority')} />
          <div>
            <label className="mb-1 block text-sm font-medium">Attachments (images)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="text-sm"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" loading={loading}>Submit</Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
