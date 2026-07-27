import type { SubsystemSpec } from "@/lib/vehicle/subsystemContent";

/**
 * The vehicle spec-row treatment, shared by the InfoPanel (per-subsystem specs)
 * and the vehicle-details section (airframe configuration). Extracted so the
 * two stay one design system rather than drifting into look-alike copies.
 */

/**
 * Row rule. Accent Red at low alpha — enough to read as a deliberate brand
 * hairline against the dark navy, far too faint to compete with the values
 * sitting on it. Exported because the InfoPanel accordion and the
 * vehicle-details column dividers use the same rule.
 */
export const SPEC_RULE = "rgba(227, 28, 28, 0.18)";

/**
 * Label/value rows. Labels are muted and sentence case; values are monospace so
 * figures line up column-wise down the grid. Rows are separated by rules rather
 * than gaps alone, which is what makes a dense grid scannable.
 *
 * `labelWidth` only exists because the two callers have different label
 * lengths ("Cold start" vs "Frame material"); everything else is deliberately
 * fixed so the rows are visually identical wherever they appear.
 */
export default function SpecGrid({
  specs,
  labelWidth = "7rem",
}: {
  specs: SubsystemSpec[];
  labelWidth?: string;
}) {
  if (specs.length === 0) return null;
  return (
    <dl className="flex flex-col">
      {specs.map((spec, i) => (
        <div
          key={spec.label}
          className="grid items-baseline gap-x-4 gap-y-1 py-2.5"
          style={{
            gridTemplateColumns: `${labelWidth} 1fr`,
            ...(i > 0 ? { borderTop: `1px solid ${SPEC_RULE}` } : {}),
          }}
        >
          <dt className="text-xs leading-snug text-[#4A4E6E]">{spec.label}</dt>
          <dd className="font-mono text-[0.8125rem] leading-snug tabular-nums text-[#F5F5F7]">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
