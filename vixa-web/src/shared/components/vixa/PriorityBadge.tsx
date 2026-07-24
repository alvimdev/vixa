import { priorityLabel, type Priority } from "@/lib/mock-data";

const styles: Record<Priority, string> = {
  none: "bg-[color:var(--color-paper-raised)] text-[color:var(--color-ink-muted)] border border-[color:var(--color-border)]",
  low: "bg-[color:var(--color-paper-raised)] text-[color:var(--color-forest)] border border-[color:var(--color-forest-soft)]/40",
  medium: "bg-[color:var(--color-raspberry-soft)] text-[color:var(--color-raspberry)] border border-[color:var(--color-raspberry)]/20",
  high: "bg-[color:var(--color-raspberry)] text-white border border-[color:var(--color-raspberry)]",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[priority]}`}>
      {priorityLabel[priority]}
    </span>
  );
}
