/* ===================================
 * Nominal-type Enforcement Workaround
 * ===================================
 *
 * Due to TypeScript's structural-typing system, two classes that have the same
 * structure are considered the same by the compiler. In order to force the
 * compiler to treat them as separate types, the structure must be changed by
 * introducing an additional dummy property. To do this descriptively, we use
 * the NominalType type alias when adding a void dummy property, thus giving us
 * proper type checking.
 *
 * Hopefully TypeScript will introduce partial-nominal-typing in a future
 * version meaning that we don't have to use this workaround but this is the
 * tidiest solution in the meantime.
 *
 * YouTrack ticket:
 * https://tickets.epro.com/youtrack/issue/E-22923
 *
 * Official recommended workaround:
 * https://github.com/basarat/typescript-book/blob/master/docs/tips/nominalTyping.md
 *
 * Proposal for implementing nominal-typing in TypeScript:
 * https://github.com/Microsoft/TypeScript/issues/202
 */

export type NominalType = void;
