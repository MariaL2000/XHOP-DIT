import clsx from "clsx";

interface Props {
  type: "form" | "sidebar";
  rows?: number;
  className?: string;
}

export const SkeletonWrapper = ({ type, rows = 3, className }: Props) => {
  return (
    <div className={clsx("animate-pulse w-full", className)}>
      {type === "form" ? (
        <div className="space-y-6">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-12 w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
          <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" />
        </div>
      ) : (
        <div className="space-y-4">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full shrink-0" />
              <div className="h-5 w-full bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
