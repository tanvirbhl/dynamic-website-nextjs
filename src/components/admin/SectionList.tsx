'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSectionItem } from './SortableSectionItem';
import { SectionEditor } from './SectionEditor';
import { updateSectionOrder } from '@/actions/admin/reorder';
import { Loader2 } from 'lucide-react';

export function SectionList({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState(initialSections);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<any | null>(null);

  // Configure sensors for mouse/touch and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s._id === active.id);
      const newIndex = sections.findIndex((s) => s._id === over.id);

      // 1. Optimistic UI update
      const newOrderedSections = arrayMove(sections, oldIndex, newIndex);
      
      const updatedVisualSections = newOrderedSections.map((sec, index) => ({
        ...sec,
        sortOrder: index + 1,
      }));
      
      setSections(updatedVisualSections);
      setIsSaving(true);

      // 2. Perform Server Action
      const orderedIds = newOrderedSections.map((s) => s._id);
      const res = await updateSectionOrder(orderedIds);

      if (!res.success) {
        // Revert on failure
        setSections(initialSections);
        alert(res.error || 'Failed to reorder sections');
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      {/* Saving Overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving Order...
          </div>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s._id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {sections.map((section) => (
              <SortableSectionItem 
                key={section._id} 
                section={section} 
                onEdit={setEditingSection} 
              />
            ))}
            {sections.length === 0 && (
              <div className="px-6 py-8 text-center text-slate-500">
                No sections found. Add sections to build your page.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Slide-Out Editor Drawer */}
      <SectionEditor 
        section={editingSection} 
        isOpen={!!editingSection} 
        onClose={() => setEditingSection(null)}
        onSuccess={(updatedSection) => {
          // Instantly update the local state to reflect the saved changes
          setSections(sections.map(s => s._id === updatedSection._id ? updatedSection : s));
        }}
      />
    </div>
  );
}