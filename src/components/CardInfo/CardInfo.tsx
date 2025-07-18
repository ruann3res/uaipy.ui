import { Button } from '../ui/button';
import { CardInfoItem } from './CardInfoItem';

type KeyValueObject = Record<string, any>;

interface DataProps {
  data: KeyValueObject;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CardInfo = ({ data, onEdit, onDelete }: DataProps) => {
  return (
    <div className="bg-white dark:bg-primary-foreground rounded-2xl border border-gray-100 dark:border-gray-800 shadow p-6 mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 w-full transition-all">
      <div className="flex flex-wrap gap-6 items-center flex-1">
        {Object.entries(data)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => (
            <CardInfoItem key={key} keyName={key} value={value} />
          ))}
      </div>
      <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end mt-4 sm:mt-0">
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