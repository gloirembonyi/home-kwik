// utils/validation.ts
export const validateEmail = (email: string): boolean => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  export const validatePhone = (phone: string): boolean =>
    /^(\+\d{1,3}[-\s]?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4})$/.test(phone);
  
  export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
    strength: number;
  } => {
    const errors: string[] = [];
    let strength = 0;
  
    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    } else {
      strength += 25;
    }
  
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      strength += 25;
    }
  
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      strength += 25;
    }
  
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      strength += 25;
    }
  
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      strength += 25;
    }
  
    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  };