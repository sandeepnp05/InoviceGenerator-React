import { useState } from 'react';

export const useValidation = () => {
  const [validationError, setValidationError] = useState<string>('');

  // Validate name (for signup)
  const validateName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Validate password
  const validatePassword = (password: string) => {
    const passwordRequirements = [
      { regex: /^(?=.*[a-z])/, message: "Password must contain at least 1 lowercase letter" },
      { regex: /^(?=.*[A-Z])/, message: "Password must contain at least 1 uppercase letter" },
      { regex: /^(?=.*\d)/, message: "Password must contain at least 1 number" },
      { regex: /^(?=.*[!@#$%^&*])/, message: "Password must contain at least 1 special character" },
      { regex: /^.{6,}$/, message: "Password must be at least 6 characters long" }
    ];

    for (let rule of passwordRequirements) {
      if (!rule.regex.test(password)) {
        setValidationError(rule.message);
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  // Validate the form based on whether it's for login or signup
  const validateForm = (type: 'login' | 'signup', name: string, email: string, password: string) => {
    if (type === 'signup') {
      // Check name validation for signup
      if (!validateName(name)) {
        setValidationError('Name must contain only letters and spaces');
        return false;
      }
    }

    // Check email validation
    if (!validateEmail(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    // Check password validation for both login and signup
    if (!validatePassword(password)) {
      return false;
    }

    setValidationError('');
    return true;
  };

  return { validationError, validateForm };
};
