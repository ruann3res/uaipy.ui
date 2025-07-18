import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Página não encontrada</h1>
      <p className="text-lg">A página que você está procurando não existe.</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700">Voltar para a página inicial</Link>
    </div>
  )
}