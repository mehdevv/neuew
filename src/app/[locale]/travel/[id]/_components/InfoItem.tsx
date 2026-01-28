type Props = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export function InfoItem({ icon, label, value }: Props) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-avt-green flex-shrink-0">{icon}</div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
