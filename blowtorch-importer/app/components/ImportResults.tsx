interface ImportResultsProps {
  results: {
    aliasesImported: number
    triggersImported: number
    connectionName?: string
  }
  onReset: () => void
}

export default function ImportResults({ results, onReset }: ImportResultsProps) {
  return (
    <div className="text-center">
      <div className="mb-6">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Import Successful! 🎉
      </h2>
      <p className="text-gray-600 mb-2">
        Your database has been updated and downloaded
      </p>
      {results.connectionName && (
        <p className="text-sm text-gray-500 mb-6">
          Imported to: <span className="font-semibold">{results.connectionName}</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-3xl font-bold text-blue-600">
            {results.aliasesImported}
          </p>
          <p className="text-sm text-gray-600 mt-1">Aliases Imported</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-3xl font-bold text-purple-600">
            {results.triggersImported}
          </p>
          <p className="text-sm text-gray-600 mt-1">Triggers Imported</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
      >
        Import Another File
      </button>
    </div>
  )
}
