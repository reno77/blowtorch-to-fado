import { Connection } from '../lib/importer'

interface ConnectionSelectorProps {
  connections: Connection[]
  selectedConnection: Connection | null
  onSelect: (connection: Connection) => void
}

export default function ConnectionSelector({
  connections,
  selectedConnection,
  onSelect,
}: ConnectionSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">
        🌐 Select Connection
      </label>
      <p className="text-sm text-gray-600 mb-3">
        Choose which MUD connection to import aliases and triggers to:
      </p>
      
      <div className="space-y-2">
        {connections.map((connection) => (
          <button
            key={connection.id}
            onClick={() => onSelect(connection)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
              selectedConnection?.id === connection.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {connection.display_name}
                </p>
                <p className="text-sm text-gray-600">
                  {connection.host_name}:{connection.port_number}
                </p>
              </div>
              {selectedConnection?.id === connection.id && (
                <svg
                  className="h-6 w-6 text-blue-500"
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
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
