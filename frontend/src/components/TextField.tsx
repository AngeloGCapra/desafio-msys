import { forwardRef, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  ),
);

TextField.displayName = 'TextField';

export default TextField;
