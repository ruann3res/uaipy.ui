import { Button } from "../ui/button";
import { CardInfoItem } from "./CardInfoItem";

type KeyValueObject = Record<string, any>;

interface DataProps {
  data: KeyValueObject;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CardInfo = ({ data, onEdit, onDelete }: DataProps) => {
  return (
    <div className="bg-white dark:bg-primary-foreground rounded-2xl border border-gray-100 dark:border-gray-800 shadow p-6 mt-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 w-full transition-all max-h-48 overflow-hidden">
      <div className="flex flex-wrap gap-4 lg:gap-6 items-start flex-1 min-w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {Object.entries(data)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => (
            <CardInfoItem key={key} keyName={key} value={value} />
          ))}
      </div>
      <div className="flex flex-row lg:flex-col gap-2 items-center lg:items-end mt-4 lg:mt-0 flex-shrink-0">
        <Button
          variant="outline"
          className="w-28"
          onClick={() => onEdit(data.id)}
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          className="w-28"
          onClick={() => onDelete(data.id)}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
};
