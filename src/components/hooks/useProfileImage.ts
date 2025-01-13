// File: src/hooks/useProfileImage.ts
import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useProfileImage = (initialImage: string = '') => {
  const [image, setImage] = useState(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    image,
    fileInputRef,
    handleImageUpload,
    handleRemoveImage,
  };
};