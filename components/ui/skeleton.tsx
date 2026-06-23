import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentPropsWithoutRef<"div"> & {
  inline?: boolean;
};

function Skeleton({ className, inline = false, ...props }: SkeletonProps) {
  const Tag: any = inline ? "span" : "div";
  return (
    <Tag
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
