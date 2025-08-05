/**
 * Home Page Component
 * Dashboard with overview and quick actions
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity
} from 'lucide-react'
import { useApp } from '@core/providers/AppProvider'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function HomePage() {
  const { statistics, loading, actions } = useApp()

  useEffect(() => {
    actions.loadStatistics()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const stats = [
    {
      name: 'Total Completed',
      value: statistics?.total_amount_completed ? 
        `$${statistics.total_amount_completed.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending Amount',
      value: statistics?.total_amount_pending ? 
        `$${statistics.total_amount_pending.toLocaleString()}` : '$0',
      icon: Activity,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Completed Donations',
      value: statistics?.count_completed || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Success Rate',
      value: statistics?.success_rate ? 
        `${statistics.success_rate.toFixed(1)}%` : '0%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Donations Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Monitor and manage your donation campaigns
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center">
        <Link
          to="/donations/new"
          className="btn-primary flex items-center px-6 py-3 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Donation
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/donations"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">View All Donations</h4>
              <p className="text-sm text-gray-600 mt-1">
                Browse and manage all donations
              </p>
            </Link>
            
            <Link
              to="/stats"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">Detailed Statistics</h4>
              <p className="text-sm text-gray-600 mt-1">
                View comprehensive analytics
              </p>
            </Link>
            
            <Link
              to="/donations/new"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h4 className="font-medium text-gray-900">Create Donation</h4>
              <p className="text-sm text-gray-600 mt-1">
                Start a new donation campaign
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}