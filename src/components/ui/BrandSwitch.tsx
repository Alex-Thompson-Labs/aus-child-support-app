import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from "react-native";

// Brand colors
const BRAND_BLUE = "#2563EB"; // blue-600
const OFF_SLATE = "#475569"; // slate-600
const KNOB_WHITE = "#ffffff";

export type BrandSwitchProps = Omit<RNSwitchProps, "trackColor" | "thumbColor"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

/**
 * BrandSwitch
 *
 * Cross-platform switch component that guarantees Brand Blue for the "on" state.
 *
 * Why:
 * - Some platforms / renderers may ignore or override RN Switch colors.
 * - This wrapper enforces a consistent appearance (especially on web).
 */
export function BrandSwitch({ value, onValueChange, disabled, style, ...rest }: BrandSwitchProps) {
  // Native platforms: use the system Switch but force brand colors.
  if (Platform.OS !== "web") {
    return (
      <RNSwitch
        {...rest}
        style={style}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: OFF_SLATE, true: BRAND_BLUE }}
        thumbColor={KNOB_WHITE}
        ios_backgroundColor={OFF_SLATE}
      />
    );
  }

  // Web: render a fully custom switch to prevent CSS / UA overrides.
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.webRoot, disabled && styles.webRootDisabled, style as any]}
    >
      <View style={[styles.webTrack, value ? styles.webTrackOn : styles.webTrackOff]}>
        <View style={[styles.webThumb, value ? styles.webThumbOn : styles.webThumbOff]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    // align with RN Switch default touch target-ish
    padding: 2,
  },
  webRootDisabled: {
    opacity: 0.6,
  },
  webTrack: {
    width: 42,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  webTrackOff: {
    backgroundColor: OFF_SLATE,
  },
  webTrackOn: {
    backgroundColor: BRAND_BLUE,
  },
  webThumb: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: KNOB_WHITE,
  },
  webThumbOff: {
    alignSelf: "flex-start",
  },
  webThumbOn: {
    alignSelf: "flex-end",
  },
});
