// Script to manually clean mock tokens from browser localStorage
// Run this in browser console if you have authentication issues

(function cleanMockTokens() {
  console.log('🔍 Checking for mock tokens...')

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const currentUser = localStorage.getItem('currentUser')

  let foundMockTokens = false

  if (accessToken && accessToken.startsWith('mock_access_token_')) {
    console.log('🗑️ Removing mock access token')
    localStorage.removeItem('accessToken')
    foundMockTokens = true
  }

  if (refreshToken && refreshToken.startsWith('mock_refresh_token_')) {
    console.log('🗑️ Removing mock refresh token')
    localStorage.removeItem('refreshToken')
    foundMockTokens = true
  }

  if (foundMockTokens) {
    localStorage.removeItem('currentUser')
    console.log('✅ Mock tokens cleaned successfully!')
    console.log('🔄 Please refresh the page and login again')
  } else {
    console.log('✅ No mock tokens found')
  }

  return foundMockTokens
})()
