
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  expanded?: boolean;
  subItems?: any;
  isTitle?: boolean;
  children?: MenuItem[];  // Propriété pour les sous-menus
  badge?: any;
  parentId?: number;
}
