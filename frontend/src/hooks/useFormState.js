import { useState } from 'react';

/**
 * Small controlled-form helper: tracks field values and a submit status,
 * replacing the plain HTML `<form method="post" action="...">` submissions
 * from the original template with React-managed state.
 */
export default function useFormState(initialValues, onSubmitCallback) {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState('idle'); // idle | submitted

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus('submitted');
    if (onSubmitCallback) onSubmitCallback(values);
    setValues(initialValues);
    setTimeout(() => setStatus('idle'), 4000);
  };

  return { values, status, handleChange, handleSubmit };
}
