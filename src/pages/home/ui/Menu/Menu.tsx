import { MenuRoot } from './MenuRoot';
import { MenuItem } from './MenuItem';
import type { MenuProps } from '../../model';
import { cn } from '@/shared/lib/utils';

function Menu({ items, className, itemClassName }: MenuProps) {
  return (
    <MenuRoot className={className}>
      {items.map(item => (
        <MenuItem
          key={item.href}
          href={item.href}
          className={cn(itemClassName, item.className)}
        >
          {item.label}
        </MenuItem>
      ))}
    </MenuRoot>
  );
}

// 컴파운드 컴포넌트 패턴 유지
Menu.Root = MenuRoot;
Menu.Item = MenuItem;

export { Menu };
