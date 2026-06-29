type Props = {
  onAdd: () => void;
};

export function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-1">
        <p className="text-4xl font-black tracking-tighter">
          Nothing here yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Add your first item to start building your wardrobe.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
      >
        Add first item
      </button>
    </div>
  );
}
