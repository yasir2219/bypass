"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Define interfaces for better type safety
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

function Table({ className, ...props }: TableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "hover:bg-muted/50 border-b transition-colors",
        selected && "bg-muted/50",
        className
      )}
      data-selected={selected}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: TableCaptionProps) {
  return (
    <caption
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}