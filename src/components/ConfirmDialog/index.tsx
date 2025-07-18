interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  export function ConfirmDialog({
    open,
    title = "Confirmar ação",
    description = "Tem certeza que deseja continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
  }: ConfirmDialogProps) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={onCancel}
              type="button"
            >
              {cancelText}
            </button>
            <button
              className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
              onClick={onConfirm}
              type="button"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  } 