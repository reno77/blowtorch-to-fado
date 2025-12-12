'use client'

import { useState } from 'react'
import FileUploader from './components/FileUploader'
import ImportResults from './components/ImportResults'
import ConnectionSelector from './components/ConnectionSelector'
import { parseXML, importToDatabase, getConnections, Connection } from './lib/importer'

export default function Home() {
  const [xmlFile, setXmlFile] = useState<File | null>(null)
  const [dbFile, setDbFile] = useState<File | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingConnections, setIsLoadingConnections] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDbFileSelect = async (file: File | null) => {
    setDbFile(file)
    setConnections([])
    setSelectedConnection(null)
    setError(null)

    if (file) {
      setIsLoadingConnections(true)
      try {
        const dbBuffer = await file.arrayBuffer()
        const loadedConnections = await getConnections(dbBuffer)
        setConnections(loadedConnections)
        
        // Auto-select first connection if only one exists
        if (loadedConnections.length === 1) {
          setSelectedConnection(loadedConnections[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load connections')
        setDbFile(null)
      } finally {
        setIsLoadingConnections(false)
      }
    }
  }

  const handleImport = async () => {
    if (!xmlFile || !dbFile) {
      setError('Please upload both XML and database files')
      return
    }

    if (!selectedConnection) {
      setError('Please select a connection')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResults(null)

    try {
      // Read XML file
      const xmlText = await xmlFile.text()
      const { aliases, triggers } = parseXML(xmlText)

      // Read database file
      const dbBuffer = await dbFile.arrayBuffer()

      // Import to database (all happens in browser)
      const result = await importToDatabase(dbBuffer, aliases, triggers, selectedConnection.id)

      // Download the updated database
      const blob = new Blob([result.dbBuffer], { type: 'application/x-sqlite3' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = dbFile.name.replace('.db', '_updated.db')
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setResults({
        aliasesImported: result.aliasesImported,
        triggersImported: result.triggersImported,
        connectionName: selectedConnection.display_name,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setXmlFile(null)
    setDbFile(null)
    setConnections([])
    setSelectedConnection(null)
    setResults(null)
    setError(null)
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Blowtorch XML Importer
          </h1>
          <p className="text-gray-300">
            Import aliases and triggers from Blowtorch XML into your SQLite database
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {!results ? (
            <>
              <FileUploader
                label="Blowtorch XML File"
                accept=".xml"
                file={xmlFile}
                onFileSelect={setXmlFile}
                icon="📄"
              />

              <FileUploader
                label="SQLite Database File"
                accept=".db,.sqlite,.sqlite3"
                file={dbFile}
                onFileSelect={handleDbFileSelect}
                icon="🗄️"
              />

              {isLoadingConnections && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg
                      className="animate-spin h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-blue-800 font-medium">Loading connections...</p>
                  </div>
                </div>
              )}

              {connections.length > 0 && (
                <ConnectionSelector
                  connections={connections}
                  selectedConnection={selectedConnection}
                  onSelect={setSelectedConnection}
                />
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={!xmlFile || !dbFile || !selectedConnection || isProcessing}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  '🚀 Import and Download'
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium text-sm">ℹ️ How it works:</p>
                <ul className="text-blue-700 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Upload your Blowtorch XML configuration file</li>
                  <li>Upload your SQLite database file</li>
                  <li>Select which MUD connection to import to</li>
                  <li>Click Import to process the files</li>
                  <li>Download the updated database automatically</li>
                  <li>Your original files are never modified</li>
                </ul>
              </div>
            </>
          ) : (
            <ImportResults results={results} onReset={handleReset} />
          )}
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>All processing happens client-side in your browser</p>
          <p className="mt-1">Your files are never uploaded to any server</p>
        </div>
      </div>
    </main>
  )
}
