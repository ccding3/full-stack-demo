import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

interface EmptyStateProps {
  icon?: "info" | "warning" | "error" | "success";
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
};

export function EmptyState({ icon = "info", title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4 max-w-md">{description}</p>}
      {action}
    </div>
  );
}
