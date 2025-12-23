import type { ReactNode } from 'react';

// 메뉴 아이템 타입
export interface MenuItem {
  href: string;
  label: string;
  className?: string;
}

// Menu 컴포넌트 props
export interface MenuProps {
  items: MenuItem[];
  className?: string;
  itemClassName?: string;
}

// MenuItem 컴포넌트 props
export interface MenuItemProps {
  href: string;
  children: ReactNode;
  className?: string;
}

// MenuRoot 컴포넌트 props
export interface MenuRootProps {
  children: ReactNode;
  className?: string;
}
