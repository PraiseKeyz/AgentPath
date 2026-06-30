import type {
  ApiCourse,
  ApiEnrollment,
  ApiLesson,
  CurriculumModule,
  PublicUser,
} from '@upkora/shared'

import { apiFetch } from '@/lib/api/server'

export type { CurriculumModule }

type CoursesResponse = { courses: ApiCourse[] }
type CourseResponse = { course: ApiCourse }
type CurriculumResponse = { curriculum: CurriculumModule[] }
type EnrollmentsResponse = { enrollments: ApiEnrollment[] }
type EnrollmentResponse = { enrollment: ApiEnrollment }
type LessonResponse = { lesson: ApiLesson }
type CompletedResponse = { completedLessonIds: number[] }

export async function getPublishedCourses(): Promise<ApiCourse[]> {
  try {
    const data = await apiFetch<CoursesResponse>('/api/v1/courses')
    return data.courses
  } catch {
    return []
  }
}

export async function getFeaturedCourses(limit = 6): Promise<ApiCourse[]> {
  const courses = await getPublishedCourses()
  return courses.slice(0, limit)
}

export async function getCourseBySlug(slug: string): Promise<ApiCourse | null> {
  try {
    const data = await apiFetch<CourseResponse>(`/api/v1/courses/${slug}`)
    return data.course
  } catch {
    return null
  }
}

export async function getPublicCourseCurriculum(courseId: number): Promise<CurriculumModule[]> {
  try {
    const data = await apiFetch<CurriculumResponse>(`/api/v1/courses/${courseId}/curriculum`)
    return data.curriculum
  } catch {
    return []
  }
}

export async function getCourseCurriculum(courseId: number): Promise<CurriculumModule[]> {
  try {
    const data = await apiFetch<CurriculumResponse>(`/api/v1/courses/${courseId}/curriculum`)
    return data.curriculum
  } catch {
    return []
  }
}

export async function getEnrollmentForCourse(
  courseId: number,
  _user: PublicUser,
): Promise<ApiEnrollment | null> {
  try {
    const data = await apiFetch<EnrollmentResponse>(`/api/v1/enrollments/course/${courseId}`)
    return data.enrollment
  } catch {
    return null
  }
}

export async function getStudentEnrollments(_user: PublicUser): Promise<ApiEnrollment[]> {
  const data = await apiFetch<EnrollmentsResponse>('/api/v1/enrollments')
  return data.enrollments
}

export async function getLessonById(lessonId: number): Promise<ApiLesson | null> {
  try {
    const data = await apiFetch<LessonResponse>(`/api/v1/lessons/${lessonId}`)
    return data.lesson
  } catch {
    return null
  }
}

export async function getCompletedLessonIds(
  _user: PublicUser,
  lessonIds: number[],
): Promise<number[]> {
  if (lessonIds.length === 0) return []

  const data = await apiFetch<CompletedResponse>('/api/v1/progress/completed', {
    searchParams: { lessonIds: lessonIds.join(',') },
  })

  return data.completedLessonIds
}

export function isStudent(user: PublicUser | null): boolean {
  return Boolean(user?.roles?.includes('student'))
}