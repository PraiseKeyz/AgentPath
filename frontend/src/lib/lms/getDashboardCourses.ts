import type { ApiCourse, PublicUser } from '@upkora/shared'

import {
  getCompletedLessonIds,
  getCourseCurriculum,
  getStudentEnrollments,
} from '@/lib/lms/queries'

export type DashboardCourseItem = {
  completedLessons: number
  continueLessonId: number | null
  course: ApiCourse
  progressPercent: number
  totalLessons: number
}

export async function getDashboardCourses(user: PublicUser): Promise<DashboardCourseItem[]> {
  const enrollments = await getStudentEnrollments(user)
  const courses = enrollments
    .map((enrollment) => (typeof enrollment.course === 'object' ? enrollment.course : null))
    .filter((course): course is ApiCourse => course !== null && course.status === 'published')

  return Promise.all(
    courses.map(async (course) => {
      const curriculum = await getCourseCurriculum(course.id)
      const allLessons = curriculum.flatMap((module) => module.lessons)
      const lessonIds = allLessons.map((lesson) => lesson.id)
      const completedIds = await getCompletedLessonIds(user, lessonIds)
      const totalLessons = lessonIds.length
      const completedLessons = completedIds.length
      const progressPercent =
        totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)
      const continueLesson =
        allLessons.find((lesson) => !completedIds.includes(lesson.id)) ?? allLessons[0]

      return {
        completedLessons,
        continueLessonId: continueLesson?.id ?? null,
        course,
        progressPercent,
        totalLessons,
      }
    }),
  )
}