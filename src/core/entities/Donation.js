/**
 * Donation Entity - Core business model
 * Represents a donation in the frontend domain
 */

export const DonationStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
}

export const DonationType = {
  MONETARY: 'monetary',
  GOODS: 'goods',
  SERVICES: 'services',
}

export class Donation {
  constructor({
    id = null,
    donorName,
    donorEmail,
    amount,
    currency,
    donationType,
    status = DonationStatus.PENDING,
    description = null,
    createdAt,
    updatedAt,
    completedAt = null,
  }) {
    this.id = id
    this.donorName = donorName
    this.donorEmail = donorEmail
    this.amount = amount
    this.currency = currency
    this.donationType = donationType
    this.status = status
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.completedAt = completedAt
    
    this.validate()
  }

  validate() {
    if (!this.donorName?.trim()) {
      throw new Error('Donor name is required')
    }
    
    if (!this.donorEmail?.trim()) {
      throw new Error('Donor email is required')
    }
    
    if (!this.amount || this.amount <= 0) {
      throw new Error('Amount must be positive')
    }
    
    if (!this.currency?.trim()) {
      throw new Error('Currency is required')
    }
    
    if (!Object.values(DonationType).includes(this.donationType)) {
      throw new Error('Invalid donation type')
    }
    
    if (!Object.values(DonationStatus).includes(this.status)) {
      throw new Error('Invalid donation status')
    }
  }

  get formattedAmount() {
    return `${this.amount.toFixed(2)} ${this.currency}`
  }

  get isCompleted() {
    return this.status === DonationStatus.COMPLETED
  }

  get isPending() {
    return this.status === DonationStatus.PENDING
  }

  get isFailed() {
    return this.status === DonationStatus.FAILED
  }

  get isCancelled() {
    return this.status === DonationStatus.CANCELLED
  }

  get statusDisplay() {
    const statusMap = {
      [DonationStatus.PENDING]: 'Pending',
      [DonationStatus.COMPLETED]: 'Completed',
      [DonationStatus.FAILED]: 'Failed',
      [DonationStatus.CANCELLED]: 'Cancelled',
    }
    return statusMap[this.status] || 'Unknown'
  }

  get typeDisplay() {
    const typeMap = {
      [DonationType.MONETARY]: 'Monetary',
      [DonationType.GOODS]: 'Goods',
      [DonationType.SERVICES]: 'Services',
    }
    return typeMap[this.donationType] || 'Unknown'
  }

  get statusColor() {
    const colorMap = {
      [DonationStatus.PENDING]: 'yellow',
      [DonationStatus.COMPLETED]: 'green',
      [DonationStatus.FAILED]: 'red',
      [DonationStatus.CANCELLED]: 'gray',
    }
    return colorMap[this.status] || 'gray'
  }

  static fromApiResponse(data) {
    return new Donation({
      id: data.id,
      donorName: data.donor_name,
      donorEmail: data.donor_email,
      amount: parseFloat(data.amount),
      currency: data.currency,
      donationType: data.donation_type,
      status: data.status,
      description: data.description,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : null,
    })
  }

  toApiRequest() {
    return {
      donor_name: this.donorName,
      donor_email: this.donorEmail,
      amount: this.amount,
      currency: this.currency,
      donation_type: this.donationType,
      description: this.description,
    }
  }
}