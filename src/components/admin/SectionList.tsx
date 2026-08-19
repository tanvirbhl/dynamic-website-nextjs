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
import { createSection, deleteSection } from '@/actions/admin/sections';
import { Loader2 } from 'lucide-react';

interface SectionListProps {
  pageId: string;
  initialSections: any[];
}

export function SectionList({ pageId, initialSections }: SectionListProps) {
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

  // Create a new section
const handleCreate = async (type: 'hero' | 'about' | 'RECENT_NOTICES' | 'LEADERSHIP_MESSAGE' | 'PARTNER_LOGOS' | 'IMAGE_GALLERY' | 'CORE_VALUES') => {    setIsSaving(true);
    const res = await createSection(pageId, type);
    if (res.success) {
      setSections([...sections, res.section]);
    } else {
      alert(res.error || `Failed to create ${type} section`);
    }
    setIsSaving(false);
  };

  // Delete an existing section
  const handleDelete = async (sectionId: string) => {
    setIsSaving(true);
    const res = await deleteSection(sectionId);
    if (res.success) {
      setSections(sections.filter((s) => s._id !== sectionId));
      setEditingSection(null); // Close the drawer if it's open
    } else {
      alert(res.error || 'Failed to delete section');
    }
    setIsSaving(false);
  };

  return (
    <div className="relative">
      {/* Saving Overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
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

      {/* Creation Buttons */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-center gap-4">
        <button 
          onClick={() => handleCreate('hero')} 
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-white hover:text-[rgb(var(--color-primary))] transition-colors text-slate-600 bg-white shadow-sm flex items-center gap-2"
        >
          + Add Hero Section
        </button>
        <button 
          onClick={() => handleCreate('about')} 
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-white hover:text-[rgb(var(--color-primary))] transition-colors text-slate-600 bg-white shadow-sm flex items-center gap-2"
        >
          + Add About Section
        </button>
        <button 
          onClick={() => handleCreate('RECENT_NOTICES')} 
          className="px-4 py-2 border border-amber-300 rounded-md text-sm font-medium hover:bg-white hover:text-amber-600 transition-colors text-amber-700 bg-amber-50 shadow-sm flex items-center gap-2"
        >
          + Add Latest Notices Feed
        </button>
        <button 
          onClick={() => handleCreate('LEADERSHIP_MESSAGE')} 
          className="px-4 py-2 border border-blue-300 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600 transition-colors text-blue-700 bg-blue-50 shadow-sm flex items-center gap-2"
        >
          + Add Leadership Message
        </button>
        <button 
          onClick={() => handleCreate('PARTNER_LOGOS')} 
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors text-slate-700 bg-white shadow-sm flex items-center gap-2"
        >
          + Add Partner Logos
        </button>
        <button 
          onClick={() => handleCreate('IMAGE_GALLERY')} 
          className="px-4 py-2 border border-purple-300 rounded-md text-sm font-medium hover:bg-white hover:text-purple-600 transition-colors text-purple-700 bg-purple-50 shadow-sm flex items-center gap-2"
        >
          + Add Image Gallery
        </button>
        <button 
          onClick={() => handleCreate('CORE_VALUES')} 
          className="px-4 py-2 border border-teal-300 rounded-md text-sm font-medium hover:bg-white hover:text-teal-600 transition-colors text-teal-700 bg-teal-50 shadow-sm flex items-center gap-2"
        >
          + Add Core Values
        </button>
      </div>

      {/* Slide-Out Editor Drawer */}
      <SectionEditor 
        section={editingSection} 
        isOpen={!!editingSection} 
        onClose={() => setEditingSection(null)}
        onSuccess={(updatedSection) => {
          // Instantly update the local state to reflect the saved changes
          setSections(sections.map(s => s._id === updatedSection._id ? updatedSection : s));
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}