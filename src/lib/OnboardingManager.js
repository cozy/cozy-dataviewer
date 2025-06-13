import { Q } from 'cozy-client'

const SETTINGS_ID = 'io.cozy.dataviewer.settings.onboarding'

/**
 * Class to manage onboarding state
 */
class OnboardingManager {
  /**
   * @param {import('cozy-client').default} client - Cozy client instance
   */
  constructor(client) {
    this.client = client
  }

  /**
   * Check if onboarding is completed
   * @returns {Promise<boolean>} - Whether onboarding is completed
   */
  async isOnboardingDone() {
    const { data: settings } = await this.client.query(
      Q('io.cozy.dataviewer.settings').getById(SETTINGS_ID)
    )
    return !!settings?.done
  }

  /**
   * Mark onboarding as completed
   * @returns {Promise<void>}
   */
  async markOnboardingDone() {
    await this.client.save({
      _id: SETTINGS_ID,
      _type: 'io.cozy.dataviewer.settings',
      done: true
    })
  }

  /**
   * Reset onboarding state
   * @returns {Promise<void>}
   */
  async resetOnboarding() {
    await this.client.save({
      _id: SETTINGS_ID,
      _type: 'io.cozy.dataviewer.settings',
      done: false
    })
  }
}

export default OnboardingManager
