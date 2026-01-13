import { SemanticColors } from '@/constants/theme';

/**
 * Hook to get the current theme colors based on system color scheme.
 * This is the primary way components should access theme colors.
 * 
 * @example
 * const { colors } = useAppTheme();
 * <View style={{ backgroundColor: colors.cardBackground }} />
 */
export function useAppTheme(): { colors: typeof SemanticColors.light; isDark: boolean } {
  // Force light mode
  const isDark = false;
  const colors = SemanticColors.light;

  return { colors, isDark };
}

/**
 * @deprecated Use useAppTheme() hook instead for dynamic dark mode support.
 * This static export is kept for backward compatibility during migration.
 */
export const theme = {
  colors: SemanticColors.light,
};
