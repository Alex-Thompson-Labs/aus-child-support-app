// =============================================================================
// Partnership Proposal Types
// =============================================================================

/**
 * Partnership proposal record
 * Represents a proposal document sent to potential partner firms
 */
export interface PartnershipProposal {
    id: string;
    firm_name: string;
    slug: string;
    is_active: boolean;
    created_at: string;
}

/**
 * Proposal view tracking record
 * Tracks individual view sessions with heartbeat-based duration
 */
export interface ProposalView {
    id: string;
    proposal_id: string;
    viewed_at: string;
    last_heartbeat_at: string;
    device_info: string | null;
}

/**
 * Get device info string from User Agent
 * Returns simplified device type for analytics
 */
export function getDeviceInfo(): string {
    if (typeof navigator === 'undefined') return 'Unknown';

    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
}
