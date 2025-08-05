/**
 * Statistics Page Component
 */
import { useEffect } from 'react'
import { TrendingUp, DollarSign, Users, Clock } from 'lucide-react'
import { useApp } from '@core/providers/AppProvider'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function StatsPage() {
  const { statistics, donations, loading, actions } = useApp()

  useEffect(() => {
    actions.loadStatistics()
    actions.loadDonations()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading statistics..." />
  }

  const stats = [
    {
      name: 'Total Completed Amount',
      value: statistics?.total_amount_completed ? 
        `$${statistics.total_amount_completed.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total amount from completed donations'
    },
    {
      name: 'Pending Amount',
      value: statistics?.total_amount_pending ? 
        `$${statistics.total_amount_pending.toLocaleString()}` : '$0',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Amount waiting to be processed'
    },
    {
      name: 'Completed Donations',
      value: statistics?.count_completed || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Number of successful donations'
    },
    {
      name: 'Success Rate',
      value: statistics?.success_rate ? 
        `${statistics.success_rate.toFixed(1)}%` : '0%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Percentage of successful donations'
    },
  ]

  const recentDonations = donations.slice(0, 5)

  const averageDonation = statistics?.count_completed > 0 ? 
    (statistics.total_amount_completed / statistics.count_completed).toFixed(2) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistics & Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive overview of donation performance
        </p>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detailed Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Detailed Metrics</h3>
          </div>
          <div className="card-body">
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Total Donations</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {(statistics?.count_completed || 0) + (statistics?.count_pending || 0) + (statistics?.count_failed || 0)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Completed</dt>
                <dd className="text-sm font-medium text-green-600">
                  {statistics?.count_completed || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Pending</dt>
                <dd className="text-sm font-medium text-yellow-600">
                  {statistics?.count_pending || 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Failed</dt>
                <dd className="text-sm font-medium text-red-600">
                  {statistics?.count_failed || 0}
                </dd>
              </div>
              <div className="flex justify-between border-t pt-4">
                <dt className="text-sm text-gray-600">Average Donation</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${averageDonation}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
          </div>
          <div className="card-body">
            {recentDonations.length > 0 ? (
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {donation.donorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {donation.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {donation.formattedAmount}
                      </p>
                      <p className={`text-xs ${
                        donation.isCompleted ? 'text-green-600' :
                        donation.isPending ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {donation.statusDisplay}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent donations
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Performance Summary</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics?.success_rate ? statistics.success_rate.toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="mt-2 text-xs text-gray-500">
                Based on completed vs failed donations
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${averageDonation}
              </div>
              <div className="text-sm text-gray-600">Average Donation</div>
              <div className="mt-2 text-xs text-gray-500">
                Per completed donation
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics?.count_pending || 0}
              </div>
              <div className="text-sm text-gray-600">Pending Processing</div>
              <div className="mt-2 text-xs text-gray-500">
                Awaiting manual processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}