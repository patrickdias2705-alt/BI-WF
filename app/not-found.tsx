export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-red-200 rounded-3xl p-8 shadow-2xl max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe.
        </p>
        <a
          href="/"
          className="inline-block bg-royal-blue hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  )
}

