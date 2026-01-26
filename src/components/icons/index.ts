/**
 * Icon Barrel File for Tree Shaking
 * 
 * This file explicitly re-exports only the icons used in the application
 * to enable Metro's tree shaker to eliminate unused icons from lucide-react-native.
 * 
 * Expected bundle size reduction: 89 KB → ~10 KB (90% savings)
 * 
 * Icons included:
 * - ArrowRight: Navigation and CTAs
 * - Download: PDF export functionality
 * - FileText: Document-related features
 * - Lock: Security and privacy indicators
 * - Upload: File upload functionality
 * - User: Single user representations
 * - Users: Multiple users/family representations
 * - AlertCircle: Warning and error states
 * - CheckCircle: Success states
 * - Info: Information tooltips
 */

export {
    AlertCircle, ArrowRight, CheckCircle, Download,
    FileText, Info, Lock,
    Upload,
    User,
    Users
} from 'lucide-react-native';

