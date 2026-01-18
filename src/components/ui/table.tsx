import * as React from "react"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table className={"w-full caption-top text-sm " + (className || "")} {...props} />
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={className} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={className} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={"last:border-0 " + (className || "")} {...props} />
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&[role=checkbox]]:pr-0 " +
        (className || "")
      }
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={"px-4 py-3 align-middle " + (className || "")} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
