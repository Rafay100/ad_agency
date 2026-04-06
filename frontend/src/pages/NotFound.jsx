import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-600">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Page not found</p>
        <p className="mt-2 text-gray-600 dark:text-gray-400">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6">Go Home</Link>
      </div>
    </div>
  )
}

export default NotFound
