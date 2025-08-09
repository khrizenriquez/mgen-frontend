/**
 * Donation Repository Interface
 * Defines the contract for donation data access
 */

export class DonationRepository {
  /**
   * Create a new donation
   * @param {Object} donationData - Donation data
   * @returns {Promise<Donation>}
   */
  async create(donationData) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get donation by ID
   * @param {number} id - Donation ID
   * @returns {Promise<Donation|null>}
   */
  async getById(id) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get all donations with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise<{donations: Donation[], total: number}>}
   */
  async getAll(params = {}) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get donations by donor email
   * @param {string} email - Donor email
   * @returns {Promise<Donation[]>}
   */
  async getByEmail(email) {
    throw new Error('Method must be implemented')
  }

  /**
   * Process a pending donation
   * @param {number} id - Donation ID
   * @returns {Promise<Donation>}
   */
  async process(id) {
    throw new Error('Method must be implemented')
  }

  /**
   * Cancel a donation
   * @param {number} id - Donation ID
   * @returns {Promise<Donation>}
   */
  async cancel(id) {
    throw new Error('Method must be implemented')
  }

  /**
   * Get donation statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    throw new Error('Method must be implemented')
  }
}