import { firestoreService } from '@/lib/firestoreService'

export type AcademicStressAssessment = {
  id?: string
  userId: string
  score: number
  level: 'steady' | 'stretched' | 'overloaded'
  answers: Record<string, number>
  createdAt?: string
}

export type PersonalTask = {
  id?: string
  userId: string
  title: string
  course: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  dueDate?: string
  createdAt?: string
}

export type ConsultationBooking = {
  id?: string
  userId: string
  counselorId: string
  counselorName: string
  date: string
  time: string
  topic: string
  status: 'requested' | 'confirmed' | 'completed'
  createdAt?: string
}

export const academicStressService = {
  save: (userId: string, assessment: Omit<AcademicStressAssessment, 'id' | 'userId' | 'createdAt'>) =>
    firestoreService.addDocument('academic_stress_assessments', userId, assessment),
  list: async (userId: string) =>
    (await firestoreService.getUserDocuments('academic_stress_assessments', userId)) as (AcademicStressAssessment & { id: string })[],
}

export const taskService = {
  create: (userId: string, task: Omit<PersonalTask, 'id' | 'userId' | 'createdAt' | 'completed'>) =>
    firestoreService.addDocument('tasks', userId, { ...task, completed: false }),
  list: async (userId: string) =>
    (await firestoreService.getUserDocuments('tasks', userId)) as (PersonalTask & { id: string })[],
  update: (id: string, data: Partial<Pick<PersonalTask, 'completed' | 'priority' | 'title' | 'course' | 'dueDate'>>) =>
    firestoreService.updateDocument('tasks', id, data),
  remove: (id: string) => firestoreService.deleteDocument('tasks', id),
}

export const consultationService = {
  book: (userId: string, booking: Omit<ConsultationBooking, 'id' | 'userId' | 'createdAt' | 'status'>) =>
    firestoreService.addDocument('consultation_bookings', userId, { ...booking, status: 'requested' }),
  list: async (userId: string) =>
    (await firestoreService.getUserDocuments('consultation_bookings', userId)) as (ConsultationBooking & { id: string })[],
}
