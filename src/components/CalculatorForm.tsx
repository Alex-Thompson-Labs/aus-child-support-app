import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import type { ChildInput, FormErrors } from "../types/calculator";
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
  courtDate?: string;
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
  onCourtDateChange: (value: string) => void;
}

export function CalculatorForm({
  incomeA,
  incomeB,
  supportA,
  supportB,
  childrenData,
  relDepA,
  relDepB,
  courtDate,
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
  onCourtDateChange,
}: CalculatorFormProps) {
  const [showRelDeps, setShowRelDeps] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Combined Parents Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Income</Text>
        
        {/* Parent A */}
        <View style={styles.inputGroup}>
          <View style={[styles.labelRow, { gap: 8 }]}>
            <Text style={styles.parentTitleA}>Parent A</Text>
            <Text style={styles.label}> - Adjusted Taxable Income</Text>
            <HelpTooltip
              header="What's Included in ATI?"
              what="- Taxable income
- Reportable fringe benefits
- Target foreign income
- Total net investment loss
- Tax-free pensions or benefits
- Reportable superannuation contributions"
              why=""
              hideWhatLabel
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
                trackColor={{ false: "#475569", true: "#f59e0b" }}
                thumbColor="#ffffff"
                style={styles.smallSwitch}
              />
              <Text style={styles.switchLabelSmall}>Inc. support</Text>
              <HelpTooltip
                header="MINIMUM ANNUAL RATE / FIXED ANNUAL RATE"
                what="Whether or not a parent received an income support payment in their taxable income can move the assessment away from using the formula to a fixed or minimum rate under certain conditions"
                why=""
                hideWhatLabel
              />
            </View>
          </View>
          {errors.incomeA && (
            <Text style={styles.errorText}>{errors.incomeA}</Text>
          )}
        </View>

        {/* Parent B */}
        <View style={[styles.inputGroup, { marginTop: 16 }]}>
          <View style={styles.labelRow}>
            <Text style={styles.parentTitleB}>Parent B</Text>
            <Text style={styles.label}> - Adjusted Taxable Income</Text>
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
                trackColor={{ false: "#475569", true: "#f59e0b" }}
                thumbColor="#ffffff"
                style={styles.smallSwitch}
              />
              <Text style={styles.switchLabelSmall}>Inc. support</Text>
            </View>
          </View>
          {errors.incomeB && (
            <Text style={styles.errorText}>{errors.incomeB}</Text>
          )}
        </View>
      </View>

      {/* Children Card */}
      <View style={styles.card}>
        <View style={[styles.labelRow, { gap: 8, marginBottom: 8 }]}>
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>CARE</Text>
          <HelpTooltip
            header="CARE = OVERNIGHT"
            what="Enter the number of nights each parent has care of the child per week, fortnight, or year and if the child is over or under 13 years of age."
            why=""
            hideWhatLabel
          />
        </View>

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
          <Text style={styles.sectionHeading}>Relevant Dependents</Text>
          <HelpTooltip
            header="REDUCES ASSESSABLE INCOME"
            what="Number of children in the parents care from a different relationship and not a claimed for child in a separate case."
            why=""
            hideWhatLabel
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
            trackColor={{ false: "#475569", true: "#f59e0b" }}
            thumbColor="#ffffff"
            style={[styles.smallSwitch, styles.relDepsSwitch]}
          />
        </View>

        {showRelDeps && (
          <View style={styles.relDepsRow}>
            {/* Parent A Section */}
            <View style={styles.relDepsParentSection}>
              <Text style={styles.parentTitleA}>Parent A</Text>
              <View style={styles.relDepsInputPair}>
                <View style={styles.relDepsInputGroup}>
                  <TextInput
                    style={styles.relDepsInput}
                    value={relDepA.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                  <Text style={[styles.relDepsAgeLabel, { color: '#f59e0b' }]}>&lt;13</Text>
                </View>
                <View style={styles.relDepsInputGroup}>
                  <TextInput
                    style={styles.relDepsInput}
                    value={relDepA.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepAChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                  <Text style={[styles.relDepsAgeLabel, { color: '#f59e0b' }]}>13+</Text>
                </View>
              </View>
            </View>

            {/* Parent B Section */}
            <View style={styles.relDepsParentSection}>
              <Text style={styles.parentTitleB}>Parent B</Text>
              <View style={styles.relDepsInputPair}>
                <View style={styles.relDepsInputGroup}>
                  <TextInput
                    style={styles.relDepsInput}
                    value={relDepB.u13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({ u13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                  <Text style={[styles.relDepsAgeLabel, { color: '#f59e0b' }]}>&lt;13</Text>
                </View>
                <View style={styles.relDepsInputGroup}>
                  <TextInput
                    style={styles.relDepsInput}
                    value={relDepB.plus13.toString()}
                    onChangeText={(text) =>
                      onRelDepBChange({ plus13: parseInt(text.replace(/[^0-9]/g, "")) || 0 })
                    }
                    keyboardType="numeric"
                  />
                  <Text style={[styles.relDepsAgeLabel, { color: '#f59e0b' }]}>13+</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Court Date Card */}
      <View style={styles.card}>
        <View style={[styles.labelRow, { gap: 8 }]}>
          <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>Court Date (Optional)</Text>
          <HelpTooltip
            header="PREPARATION IS KEY"
            what="Cases with upcoming court dates may benefit from urgent legal advice."
            why=""
            hideWhatLabel
          />
        </View>
        <TextInput
          style={styles.courtDateInput}
          value={courtDate || ""}
          onChangeText={onCourtDateChange}
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#64748b"
          keyboardType="numbers-and-punctuation"
        />
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
    paddingBottom: 180, // Extra padding for fixed bottom payment card
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
  sectionHeading: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981", // emerald-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
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
  parentTitleA: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6", // blue-500
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  parentTitleB: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8b5cf6", // violet-500
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
    gap: 12,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: 150,
    flex: 0,
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
    alignItems: "flex-start",
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
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
    marginTop: -5,
  },
  relDepsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 24,
    paddingBottom: 0,
  },
  relDepsParentSection: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  relDepsInputPair: {
    flexDirection: "row",
    gap: 24,
    justifyContent: "center",
  },
  relDepsInputGroup: {
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  relDepsLabel: {
    fontSize: 14,
    color: "#94a3b8", // slate-400
  },
  relDepsLabelB: {
    marginLeft: 8,
  },
  relDepsAgeLabel: {
    fontSize: 13,
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
  courtDateInput: {
    backgroundColor: "#334155", // slate-700
    borderWidth: 1,
    borderColor: "#475569", // slate-600
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 16,
    marginTop: 8,
  },
  courtDateHint: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginTop: 4,
    fontStyle: "italic",
  },
});

