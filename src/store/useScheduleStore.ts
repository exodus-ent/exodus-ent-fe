import { create } from 'zustand';

interface Schedule {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  idol: string;
  description?: string;
  thumbnailUrl?: string;
  detailUrl?: string;
}

interface ScheduleStore {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  isModalOpen: boolean;
  setSchedules: (schedules: Schedule[]) => void;
  setSelectedSchedule: (schedule: Schedule | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  selectedSchedule: null,
  isModalOpen: false,
  setSchedules: (schedules) => set({ schedules }),
  setSelectedSchedule: (schedule) => set({ selectedSchedule: schedule }),
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));
