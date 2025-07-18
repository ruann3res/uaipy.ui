import { Link } from "react-router-dom";
import { Tag } from "@/components/Tag";

interface LinkValue {
  text: string;
  to: string;
  isLink: true;
}

interface CardInfoItemProps {
  keyName: string;
  value: any | LinkValue | TagValue;
}

type TagValue = {
  tag: string;
  color: string;
}

export const CardInfoItem = ({ keyName, value }: CardInfoItemProps) => {
  const isLinkValue = (val: any): val is LinkValue => {
    return val && typeof val === 'object' && val.isLink === true && val.text && val.to;
  };
  const isTagValue = (val: any): val is TagValue => {
    return val && typeof val === 'object' && typeof val.tag === 'string' && typeof val.color === 'string';
  };

  return (
    <div className="flex flex-col min-w-[140px] max-w-[240px]">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 truncate">
        {keyName}
      </h3>
      <div className="text-lg font-bold text-gray-800 dark:text-white break-words">
        {isLinkValue(value) ? (
          <Link 
            to={value.to} 
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-semibold"
          >
            {value.text}
          </Link>
        ) : isTagValue(value) ? (
          <span className="inline-block mt-1"><Tag tag={value.tag} color={value.color} /></span>
        ) : (
          String(value)
        )}
      </div>
    </div>
  );
}; 




/*

// Função para formatar badges de status
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Em Planejamento': 'bg-gray-100 text-gray-800',
      'Em Desenvolvimento': 'bg-blue-100 text-blue-800',
      'Em Teste': 'bg-yellow-100 text-yellow-800',
      'Concluído': 'bg-green-100 text-green-800',
      'Pausado': 'bg-red-100 text-red-800'
    };
    
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  // Função para formatar badges de categoria
  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Web': 'bg-purple-100 text-purple-800',
      'Mobile': 'bg-green-100 text-green-800',
      'Desktop': 'bg-blue-100 text-blue-800',
      'API': 'bg-orange-100 text-orange-800',
      'DevOps': 'bg-gray-100 text-gray-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Desenvolvimento': 'bg-indigo-100 text-indigo-800',
      'Outro': 'bg-gray-100 text-gray-800'
    };
    
    const colorClass = categoryColors[category] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  // Função para formatar badges de dispositivos
  const getDeviceBadge = (count: number) => {
    if (count === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Nenhum dispositivo
        </span>
      );
    } else if (count === 1) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          1 dispositivo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {count} dispositivos
        </span>
      );
    }
  };

  // Função para formatar texto longo (descrição)
  const formatText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

*/