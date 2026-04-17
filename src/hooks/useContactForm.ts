import { FormEvent, useState } from 'react';

const EMAIL_REGEX = /^[^\s@]{1,}@[^\s@]{1,}\.[^\s@]{1,}$/;

interface UseContactFormReturn {
  name: string;
  email: string;
  message: string;
  status: string | null;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setMessage: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isValid: boolean;
}

export const useContactForm = (): UseContactFormReturn => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const isValid = (): boolean => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return false;
    }

    return EMAIL_REGEX.test(trimmedEmail);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus('Please complete all fields before sending your message.');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    const subject = encodeURIComponent(`Spark contact from ${trimmedName}`);
    const body = encodeURIComponent([
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      '',
      trimmedMessage,
    ].join('\n'));

    window.location.href = `mailto:hello@sparkinsights.app?subject=${subject}&body=${body}`;
    setStatus('Your email app is opening now. If it does not open, send a note to hello@sparkinsights.app.');
  };

  return {
    name,
    email,
    message,
    status,
    setName,
    setEmail,
    setMessage,
    handleSubmit,
    isValid: isValid(),
  };
};
