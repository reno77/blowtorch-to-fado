interface FileUploaderProps {
  label: string
  accept: string
  file: File | null
  onFileSelect: (file: File | null) => void
  icon?: string
}

export default function FileUploader({
  label,
  accept,
  file,
  onFileSelect,
  icon = '📁',
}: FileUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    onFileSelect(selectedFile)
  }

  const handleRemove = () => {
    onFileSelect(null)
  }

  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-semibold mb-2">
        {icon} {label}
      </label>
      
      {!file ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-${label}`}
          />
          <label
            htmlFor={`file-${label}`}
            className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">{accept.toUpperCase()}</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-green-500"
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
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}
