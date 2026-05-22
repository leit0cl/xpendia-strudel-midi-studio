interface Props {
  label: string;
}

export function LoadingOverlay({ label }: Props) {
  return (
    <div className="dancing-loading">
      <div className="dancing-loading-dot" />
      <span>{label}</span>
    </div>
  );
}
