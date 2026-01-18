/**
 * Complexity Trap Detection Tests
 * 
 * Tests for the Lead Trap detection logic (Formulas 4, 5, 6)
 */

import { NonParentCarerInfo } from '../calculator';
import { detectComplexityTrap } from '../complexity-detection';

describe('detectComplexityTrap', () => {
    const DEFAULT_NPC: NonParentCarerInfo = {
        enabled: false,
    };

    const NPC_ENABLED: NonParentCarerInfo = {
        enabled: true,
        hasDeceasedParent: false,
        hasOverseasParent: false,
    };

    describe('when NPC is disabled', () => {
        it('should return not trapped for standard parent scenario (Formula 1)', () => {
            const result = detectComplexityTrap(DEFAULT_NPC, false, false);

            expect(result.isTrapped).toBe(false);
            expect(result.reason).toBeUndefined();
        });

        it('should return not trapped even with multi-case (Formula 3)', () => {
            const result = detectComplexityTrap(DEFAULT_NPC, true, true);

            expect(result.isTrapped).toBe(false);
            expect(result.reason).toBeUndefined();
        });
    });

    describe('when NPC is enabled without complexity factors (Formula 2)', () => {
        it('should return not trapped for standard NPC scenario', () => {
            const result = detectComplexityTrap(NPC_ENABLED, false, false);

            expect(result.isTrapped).toBe(false);
            expect(result.reason).toBeUndefined();
        });
    });

    describe('Formula 4 Trap: NPC + Multi-case', () => {
        it('should trap when NPC enabled and Parent A has other children', () => {
            const result = detectComplexityTrap(NPC_ENABLED, true, false);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_4_NPC_MULTI_CASE');
            expect(result.displayReason).toBe('multi-case considerations');
        });

        it('should trap when NPC enabled and Parent B has other children', () => {
            const result = detectComplexityTrap(NPC_ENABLED, false, true);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_4_NPC_MULTI_CASE');
        });

        it('should trap when NPC enabled and both parents have other children', () => {
            const result = detectComplexityTrap(NPC_ENABLED, true, true);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_4_NPC_MULTI_CASE');
        });
    });

    describe('Formula 5 Trap: NPC + Overseas Parent', () => {
        it('should trap when hasOverseasParent is true', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: false,
                hasOverseasParent: true,
            };

            const result = detectComplexityTrap(npc, false, false);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_5_OVERSEAS');
            expect(result.displayReason).toBe('overseas parent considerations');
        });
    });

    describe('Formula 6 Trap: NPC + Deceased Parent', () => {
        it('should trap when hasDeceasedParent is true', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: true,
                hasOverseasParent: false,
            };

            const result = detectComplexityTrap(npc, false, false);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_6_DECEASED');
            expect(result.displayReason).toBe('estate considerations');
        });
    });

    describe('Trap priority', () => {
        it('should prioritize Formula 6 (deceased) over Formula 5 (overseas)', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: true,
                hasOverseasParent: true,
            };

            const result = detectComplexityTrap(npc, false, false);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_6_DECEASED');
        });

        it('should prioritize Formula 6 (deceased) over Formula 4 (multi-case)', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: true,
                hasOverseasParent: false,
            };

            const result = detectComplexityTrap(npc, true, true);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_6_DECEASED');
        });

        it('should prioritize Formula 5 (overseas) over Formula 4 (multi-case)', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: false,
                hasOverseasParent: true,
            };

            const result = detectComplexityTrap(npc, true, true);

            expect(result.isTrapped).toBe(true);
            expect(result.reason).toBe('FORMULA_5_OVERSEAS');
        });
    });

    describe('Edge cases', () => {
        it('should handle undefined status flags', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                // hasDeceasedParent and hasOverseasParent are undefined
            };

            const result = detectComplexityTrap(npc, false, false);

            expect(result.isTrapped).toBe(false);
        });

        it('should handle explicit false values', () => {
            const npc: NonParentCarerInfo = {
                enabled: true,
                hasDeceasedParent: false,
                hasOverseasParent: false,
            };

            const result = detectComplexityTrap(npc, false, false);

            expect(result.isTrapped).toBe(false);
        });
    });
});
