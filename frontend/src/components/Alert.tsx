export default function Alert({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
      {message}
    </div>
  );
}
