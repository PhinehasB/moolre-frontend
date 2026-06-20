/** Maps every key of a form-values type to an optional error string. */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Renders a validation error message beneath a field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export const inputCls = "w-full h-auto px-4 py-2.5 text-sm rounded-lg";
