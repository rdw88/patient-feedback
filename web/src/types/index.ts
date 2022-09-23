type User = {
  id: number
  first_name: string
  last_name: string
}

export type Doctor = User & {}
export type Patient = User & {}

export type Appointment = {
  id: number
  start_date: string
  doctor: Doctor
  patient: Patient
  status: string
}

export type QuestionnaireResponse = {
  id: number
  name: string
  appointment: Appointment
  answers: Array<Answer>
}

export type Answer = {
	id: number
	question: Question
	response: string
	alternate_response: string
}

export type Question = {
  id: number
  title: string
  body: string
  type: 'text' | 'yesno' | 'rating'
}
