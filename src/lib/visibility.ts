/**
 * Global Visibility & Scheduling Rules
 * Ensures inactive, disabled, or out-of-schedule content NEVER renders on the frontend.
 */

// 1. Section Visibility & Scheduling Logic
export function isSectionVisible(section: { 
  isVisible: boolean; 
  schedule?: { startDate?: Date | null; endDate?: Date | null } 
}): boolean {
  if (!section.isVisible) return false;

  const now = new Date();
  if (section.schedule) {
    if (section.schedule.startDate && now < new Date(section.schedule.startDate)) {
      return false; 
    }
    if (section.schedule.endDate && now > new Date(section.schedule.endDate)) {
      return false; 
    }
  }

  return true;
}

// 2. Publishable Entity Status Logic (Pages, Products, News, etc.)
export function isPublished(entity: { status: string }): boolean {
  return entity.status === 'PUBLISHED';
}

// 3. Navigation Hierarchy Logic (Handles Dropdowns & Empty Parents)
export interface NavNode {
  _id: any;
  label: string;
  url: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: any;
  openInNewTab: boolean;
  children: NavNode[];
}

export function buildActiveMenuTree(items: any[]): NavNode[] {
  const activeItems = items.filter(item => item.isActive);

  const menuMap = new Map<string, NavNode>();
  activeItems.forEach(item => {
    menuMap.set(item._id.toString(), { 
      ...item, 
      _id: item._id.toString(),
      parentId: item.parentId ? item.parentId.toString() : null,
      children: [] 
    });
  });

  const tree: NavNode[] = [];

  activeItems.forEach(item => {
    const node = menuMap.get(item._id.toString())!;
    if (node.parentId) {
      const parent = menuMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  const sortNodes = (nodes: NavNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach(node => {
      if (node.children.length > 0) sortNodes(node.children);
    });
  };
  sortNodes(tree);

  return tree.filter(node => {
    const isDropdownWrapper = node.url === '#' || node.url === '';
    const hasActiveChildren = node.children.length > 0;
    
    if (isDropdownWrapper && !hasActiveChildren) {
      return false; 
    }
    
    return true;
  });
}