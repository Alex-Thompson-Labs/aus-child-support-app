/**
 * Get Client IP Address
 * 
 * Retrieves the user's IP address for consent verification and audit trail.
 * Used for Privacy Act 1988 compliance.
 */

/**
 * Get the client's IP address
 * 
 * For web: Uses ipify API (free, reliable)
 * For mobile: Returns 'mobile' (IP capture not practical on native apps)
 * 
 * @returns Promise<string> IP address or 'unknown' if unavailable
 */
export async function getClientIP(): Promise<string> {
  try {
    // For web platform, fetch IP from ipify
    if (typeof window !== 'undefined') {
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP address');
      }
      
      const data = await response.json();
      return data.ip || 'unknown';
    }
    
    // For mobile apps, IP capture is not practical
    return 'mobile';
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'unknown';
  }
}
