const colorMap: Record<string, string> = {
  green: 'bg-green-200 text-green-800',
  red: 'bg-red-200 text-red-800',
  yellow: 'bg-yellow-200 text-yellow-800',
  blue: 'bg-blue-200 text-blue-800',
  gray: 'bg-gray-200 text-gray-800',
  orange: 'bg-orange-200 text-orange-800',
  purple: 'bg-purple-200 text-purple-800',
};

export function Tag({ tag, color = "green" }: { tag: string, color?: string }) {
  const colorClass = colorMap[color] || colorMap.green;
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}>{tag}</span>
  );
}
