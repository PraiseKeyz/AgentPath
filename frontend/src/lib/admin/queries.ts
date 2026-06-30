import type {
  AdminCourseDetail,
  ApiCourse,
  ApiEnrollment,
  ApiLesson,
  ApiMedia,
  ApiModule,
  ApiProgress,
  PublicUser,
} from '@upkora/shared'

import { apiFetch } from '@/lib/api/server'

type CoursesResponse = { courses: ApiCourse[] }
type CourseResponse = { course: AdminCourseDetail | ApiCourse }
type EnrollmentsResponse = { enrollments: ApiEnrollment[] }
type ProgressResponse = { progress: ApiProgress[] }
type UsersResponse = { users: PublicUser[] }
type MediaResponse = { media: ApiMedia[] }

export async function getAdminCourses(): Promise<ApiCourse[]> {
  const data = await apiFetch<CoursesResponse>('/api/v1/admin/courses')
  return data.courses
}

export async function getAdminCourse(courseId: number): Promise<AdminCourseDetail | null> {
  try {
    const data = await apiFetch<CourseResponse>(`/api/v1/admin/courses/${courseId}`)
    return data.course as AdminCourseDetail
  } catch {
    return null
  }
}

export async function getAdminInstructors(): Promise<PublicUser[]> {
  const users = await getAdminUsers()
  return users.filter(
    (user) => user.roles.includes('admin') || user.roles.includes('instructor'),
  )
}

export async function getAdminEnrollments(): Promise<ApiEnrollment[]> {
  const data = await apiFetch<EnrollmentsResponse>('/api/v1/admin/enrollments')
  return data.enrollments
}

export async function getAdminProgress(): Promise<ApiProgress[]> {
  const data = await apiFetch<ProgressResponse>('/api/v1/admin/progress')
  return data.progress
}

export async function getAdminUsers(): Promise<PublicUser[]> {
  const data = await apiFetch<UsersResponse>('/api/v1/admin/users')
  return data.users
}

export async function getAdminMedia(): Promise<ApiMedia[]> {
  const data = await apiFetch<MediaResponse>('/api/v1/media')
  return data.media
}

type LessonResponse = { lesson: ApiLesson }
type ModuleResponse = { module: ApiModule }
type EnrollmentResponse = { enrollment: ApiEnrollment }
type ProgressRecordResponse = { progress: ApiProgress }
type MediaItemResponse = { media: ApiMedia }

async function fetchAdminRecord<T>(path: string): Promise<T | null> {
  try {
    return await apiFetch<T>(path)
  } catch {
    return null
  }
}

export async function getAdminLesson(lessonId: number): Promise<ApiLesson | null> {
  const data = await fetchAdminRecord<LessonResponse>(`/api/v1/admin/lessons/${lessonId}`)
  return data?.lesson ?? null
}

export async function getAdminModule(moduleId: number): Promise<ApiModule | null> {
  const data = await fetchAdminRecord<ModuleResponse>(`/api/v1/admin/modules/${moduleId}`)
  return data?.module ?? null
}

export async function getAdminEnrollment(enrollmentId: number): Promise<ApiEnrollment | null> {
  const data = await fetchAdminRecord<EnrollmentResponse>(
    `/api/v1/admin/enrollments/${enrollmentId}`,
  )
  return data?.enrollment ?? null
}

export async function getAdminProgressRecord(progressId: number): Promise<ApiProgress | null> {
  const data = await fetchAdminRecord<ProgressRecordResponse>(
    `/api/v1/admin/progress/${progressId}`,
  )
  return data?.progress ?? null
}

export async function getAdminMediaItem(mediaId: number): Promise<ApiMedia | null> {
  const data = await fetchAdminRecord<MediaItemResponse>(`/api/v1/media/${mediaId}`)
  return data?.media ?? null
}
