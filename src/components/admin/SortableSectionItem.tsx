'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil } from 'lucide-react';
import { ActiveToggle } from './ActiveToggle';

interface SortableSectionItemProps {
  section: {
    _id: string;
    type: string;
    sortOrder: number;
    isVisible: boolean;
    content?: any;
  };
  onEdit: (section: any) => void;
}

export function SortableSectionItem({ section, onEdit }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`px-6 py-4 flex items-center justify-between transition-colors border-b border-slate-100 last:border-0 bg-white ${
        isDragging ? 'shadow-lg opacity-90' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded transition-colors"
        >
          <GripVertical size={20} />
        </div>

        <div className="w-12 h-12 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase text-xs shadow-sm">
          {section.type}
        </div>
        
        <div>
          <p className="font-semibold text-slate-800 capitalize">{section.type} Section</p>
          <p className="text-xs text-slate-500">
            Database ID: {section._id.slice(-6)} • Order: {section.sortOrder}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            section.isVisible
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          {section.isVisible ? 'ACTIVE' : 'INACTIVE'}
        </span>

        {/* Reusing our Universal Toggle here! */}
        <ActiveToggle id={section._id} initialStatus={section.isVisible} />
        
        {/* NEW EDIT BUTTON */}
        <button 
          onClick={() => onEdit(section)}
          className="p-1.5 ml-2 text-slate-400 hover:text-[rgb(var(--color-primary))] hover:bg-slate-100 rounded transition-colors"
          title="Edit Section Content"
        >
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}