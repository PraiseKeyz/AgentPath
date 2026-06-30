export interface SafeUser {
  id: string
  name: string
  email: string
  university: string
  courseOfStudy: string
  yearOfStudy: number
  goals: string[]
  isOnboarded: boolean
  createdAt: string
}

export interface Conversation {
  _id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Opportunity {
  _id: string
  title: string
  description: string
  type: 'scholarship' | 'fellowship' | 'internship' | 'competition' | 'grant'
  provider: string
  deadline: string | null
  eligibility: string
  applicationUrl: string
  tags: string[]
  isActive: boolean
}

export interface Milestone {
  _id: string
  title: string
  description: string
  opportunityId: string | null
  status: 'pending' | 'in_progress' | 'done'
  dueDate: string | null
  createdAt: string
}

export interface Roadmap {
  _id: string
  userId: string
  milestones: Milestone[]
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  error: null | {
    statusCode: number
    type: string
    details: string
    path: string
  }
  timestamp: string
}
