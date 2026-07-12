export default function DeleteDialog({
  title,
  message,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#151b28] p-6 rounded-xl w-[380px] border border-red-500">

        <h2 className="text-lg font-bold text-red-400 mb-3">
          {title}
        </h2>

        <div className="mb-6">

    <p className="text-gray-300">
        {message}
    </p>

    <p className="text-red-400 text-sm mt-2">
        This action cannot be undone.
    </p>

</div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}