// This file contains type declarations for your components
declare module '@/components/ui/button' {
  import * as React from 'react';
  
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  
  export const buttonVariants: (props: any) => string;
}

declare module '@/components/ui/card' {
  import * as React from 'react';
  
  export const Card: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  
  export const CardHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  
  export const CardContent: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  
  export const CardTitle: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLHeadingElement>
  >;
  
  export const CardDescription: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>
  >;
  
  export const CardFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@/components/ui/table' {
  import * as React from 'react';
  
  export const Table: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableElement> & React.RefAttributes<HTMLTableElement>
  >;
  
  export const TableHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
  
  export const TableBody: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
  
  export const TableFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>
  >;
  
  export const TableHead: React.ForwardRefExoticComponent<
    React.ThHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>
  >;
  
  export const TableRow: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>
  >;
  
  export const TableCell: React.ForwardRefExoticComponent<
    React.TdHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>
  >;
  
  export const TableCaption: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLTableCaptionElement> & React.RefAttributes<HTMLTableCaptionElement>
  >;
}

declare module 'lucide-react' {
  import * as React from 'react';
  
  export const Plus: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Search: React.FC<React.SVGProps<SVGSVGElement>>;
}
