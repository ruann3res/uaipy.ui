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
