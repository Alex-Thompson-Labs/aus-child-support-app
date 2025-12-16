import React, { useState } from "react";
import { View, Text, TextInput, Switch, Pressable, ScrollView, StyleSheet } from "react-native";
import type { FormErrors, ChildInput } from "../types/calculator";
import { ChildRow } from "./ChildRow";
import { HelpTooltip } from "./HelpTooltip";

interface CalculatorFormProps {
  incomeA: number;
  incomeB: number;
  supportA: boolean;
  supportB: boolean;
  childrenData: ChildInput[];
  relDepA: { u13: number; plus13: number };
  relDepB: { u13: number; plus13: number };
  errors: FormErrors;
  incomePercA?: number;
  incomePercB?: number;
  csiA?: number;
  csiB?: number;
  onIncomeAChange: (value: number) => void;
  onIncomeBChange: (value: number) => void;
  onSupportAChange: (checked: boolean) => void;
  onSupportBChange: (checked: boolean) => void;
  onAddChild: () => void;
  onRemoveChild: (childId: string) => void;
  onUpdateChild: (childId: string, updates: Partial<ChildInput>) => void;
  onRelDepAChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
  onRelDepBChange: (updates: Partial<{ u13: number; plus13: number }>) => void;
}

export function CalculatorForm({
  incomeA,
  incomeB,
  supportA,
  supportB,
  childrenData,
  relDepA,
  relDepB,
  errors,
  incomePercA,
  incomePercB,
  csiA,
  csiB,
  onIncomeAChange,
  onIncomeBChange,
  onSupportAChange,
  onSupportBChange,
  onAddChild,
  onRemoveChild,
  onUpdateChild,
  onRelDepAChange,
  onRelDepBChange,
}: CalculatorFormProps) {
  const [showRelDeps, setShowRelDeps] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Combined Parents Card */}
      <View style={styles.card}>
        <View style={styles.parentsGrid}>
          {/* Parent A */}
          <View style={styles.parentSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.parentTitle}>Parent A</Text>
                <Text style={styles.label}> - Adjusted Taxable Income</Text>
                <HelpTooltip
                  what="Enter ATI from tax assessment. Includes taxable income plus reportable fringe benefits, foreign income, and certain tax-free pensions."
                  why="ATI determines each parent's capacity to pay and their share of combined child support income."
                />
              </View>
              <View style={styles.inputRow}>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.currencyInput, errors.incomeA && styles.inputError]}
                    value={incomeA ? incomeA.toString() : ""}
                    onChangeText={(text) => {
                      const val = text.replace(/[^0-9]/g, "");
                      onIncomeAChange(parseInt(val) || 0);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                <View style={styles.switchRow}>
                  <Switch
                    value={supportA}
                    onValueChange={onSupportAChange}
                    trackColor={{ false: "#475569", true: "#3b82f6" }}
                    thumbColor="#ffffff"
                    style={styles.smallSwitch}
                  />
                  <Text style={styles.switchLabelSmall}>Inc. support</Text>
                  <HelpTooltip
                    what="Check if parent received Centrelink income support (JobSeeker, Parenting Payment, etc.) during the period."
                    why="Income support recipients have their income set to 2/3 of annualised MTAWE, which may be higher than actual income."
                  />
                </View>
              </View>
              {errors.incomeA && (
                <Text style={styles.errorText}>{errors.incomeA}</Text>
              )}
              {incomePercA !== undefined && (
                <View style={styles.incomeBarContainer}>
                  <View style={styles.incomeBar}>
                    <View style={[styles.incomeBarFill, { width: `${incomePercA}%`, backgroundColor: "#3b82f6" }]} />
                  </View>
                  <Text style={styles.incomePercText}>{Math.round(incomePercA)}%</Text>
                  {csiA !== undefined && (
                    <Text style={styles.csiText}>CSI: ${Math.round(csiA).toLocaleString()}</Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Parent B */}
          <View style={styles.parentSection}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.parentTitle}>Parent B</Text>
                <Text style={styles.label}> - Adjusted Taxable Income</Text>
                <HelpTooltip
                  what="Enter ATI from tax assessment. Includes taxable income plus reportable fringe benefits, foreign income, and certain tax-free pensions."
                  why="ATI determines each parent's capacity to pay and their share of combined child support income."
                />
              </View>
              <View style={styles.inputRow}>
                <View style={styles.currencyInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={[styles.currencyInput, errors.incomeB && styles.inputError]}
                    value={incomeB ? incomeB.toString() : ""}
                    onChangeText={(text) => {
                      const val = text.replace(/[^0-9]/g, "");
                      onIncomeBChange(parseInt(val) || 0);
                    }}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
                <View style={styles.switchRow}>
                  <Switch
                    value={supportB}
                    onValueChange={onSupportBChange}
                    trackColor={{ false: "#475569", true: "#3b82f6" }}
                    thumbColor="#ffffff"
                    style={styles.smallSwitch}
                  />
                  <Text style={styles.switchLabelSmall}>Inc. support</Text>
                  <HelpTooltip
                    what="Check if parent received Centrelink income support (JobSeeker, Parenting Payment, etc.) during the period."
                    why="Income support recipients have their income set to 2/3 of annualised MTAWE, which may be higher than actual income."
                  />
                </View>
              </View>
              {errors.incomeB && (
                <Text style={styles.errorText}>{errors.incomeB}</Text>
              )}
              {incomePercB !== undefined && (
                <View style={styles.incomeBarContainer}>
                  <View style={styles.incomeBar}>
                    <View style={[styles.incomeBarFill, { width: `${incomePercB}%`, backgroundColor: "#a78bfa" }]} />
                  </View>
                  <Text style={[styles.incomePercText, { color: "#a78bfa" }]}>{Math.round(incomePercB)}%</Text>
                  {csiB !== undefined && (
                    <Text style={styles.csiText}>CSI: ${Math.round(csiB).toLocaleString()}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Children Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Children</Text>

        <View style={styles.childrenList}>
          {childrenData.map((child) => (
            <ChildRow
              key={child.id}
              child={child}
              onUpdate={(updates) => onUpdateChild(child.id, updates)}
              onRemove={() => onRemoveChild(child.id)}
            />
          ))}
        </View>

        {errors.children && (
          <Text style={styles.errorText}>{errors.children}</Text>
        )}

        <Pressable
          onPress={onAddChild}
          style={styles.addChildButton}
        >
          <Text style={styles.addChildButtonText}>+ Add Child</Text>
        </Pressable>
      </View>

      {/* Relevant Dependents Card */}
      <View style={styles.card}>
        <View style={styles.relDepsHeader}>
          <Text style={styles.relDepsTitle}>Relevant Dependents</Text>
          <HelpTooltip
            what="Other biological/adopted children living with a parent who are NOT part of this assessment."
            why="Reduces child support income via 'multi-case allowance', recognizing they support other children."
          />
          <Switch
            value={showRelDeps}
            onValueChange={(checked) => {
              setShowRelDeps(checked);
              if (!checked) {
                onRelDepAChange({ u13: 0, plus13: 0 });
                onRelDepBChange({ u13: 0, plus13: 0 });
              }
            }}
            trackColor={{ false: "#475569", true: "#3b82f6" }}
            thumbColor="#ffffff"
            style={[styles.smallSwitch, styles.relDepsSwitch]}
          />
        </View>

        {showRelDeps && (
          <View style={styles.relDepsRow}>
            <Text style={styles.relDepsLabel}>A:</Text>
            <TextInput
              style={styles.relDepsInput}
              value={relDepA.u13.toString()}
              onChangeText={(text) =>
                onRelDepAChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
              }
              keyboardType="numeric"
            />
            <Text style={styles.relDepsAgeLabel}>&lt;13</Text>
            <TextInput
              style={styles.relDepsInput}
              value={relDepA.plus13.toString()}
              onChangeText={(text) =>
                onRelDepAChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
              }
              keyboardType="numeric"
            />
            <Text style={styles.relDepsAgeLabel}>13+</Text>
            <Text style={[styles.relDepsLabel, styles.relDepsLabelB]}>B:</Text>
            <TextInput
              style={styles.relDepsInput}
              value={relDepB.u13.toString()}
              onChangeText={(text) =>
                onRelDepBChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
              }
              keyboardType="numeric"
            />
            <Text style={styles.relDepsAgeLabel}>&lt;13</Text>
            <TextInput
              style={styles.relDepsInput}
              value={relDepB.plus13.toString()}
              onChangeText={(text) =>
                onRelDepBChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
              }
              keyboardType="numeric"
            />
            <Text style={styles.relDepsAgeLabel}>13+</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155", // slate-700
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginTop: 2,
  },
  parentsGrid: {
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
  },
  parentSection: {
    flex: 1,
    minWidth: 200,
    gap: 12,
  },
  parentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#cbd5e1", // slate-300
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: 150,
  },
  currencySymbol: {
    position: "absolute",
    left: 12,
    color: "#94a3b8", // slate-400
    fontSize: 18,
    fontWeight: "500",
    zIndex: 1,
  },
  currencyInput: {
    width: "100%",
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    backgroundColor: "#334155", // slate-700
  },
  inputError: {
    borderColor: "#ef4444", // red-500
    backgroundColor: "rgba(239, 68, 68, 0.1)", // red-500 with opacity
  },
  errorText: {
    fontSize: 14,
    color: "#f87171", // red-400
    marginTop: 4,
  },
  incomeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  incomeBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#334155", // slate-700
    borderRadius: 4,
    overflow: "hidden",
  },
  incomeBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  incomePercText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6", // blue-500
    width: 40,
    textAlign: "right",
  },
  csiText: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smallSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchLabelSmall: {
    fontSize: 12,
    color: "#94a3b8", // slate-400
  },
  switchLabel: {
    fontSize: 14,
    color: "#cbd5e1", // slate-300
  },
  childrenList: {
    gap: 12,
  },
  addChildButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addChildButtonText: {
    color: "#94a3b8", // slate-400
    fontSize: 14,
  },
  relDepsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  relDepsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  relDepsSwitch: {
    marginLeft: "auto",
  },
  relDepsRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 8,
  },
  relDepsLabel: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  relDepsLabelB: {
    marginLeft: 8,
  },
  relDepsAgeLabel: {
    fontSize: 11,
    color: "#64748b", // slate-500
  },
  relDepsInput: {
    width: 40,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 4,
    textAlign: "center",
    color: "#ffffff",
    backgroundColor: "#334155", // slate-700
    fontSize: 14,
  },
});

