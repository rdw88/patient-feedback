from django.test import TestCase

import api.models as models
import api.serializers as serializers

import datetime


class QuestionnaireResponseSerializerTestCase(TestCase):
	fixtures = [
		'api/fixtures/appointment_types.json',
		'api/fixtures/appointment_statuses.json',
		'api/fixtures/question_answer_types.json'
	]

	def setUp(self):
		self.questionnaire = models.Questionnaire.objects.create(
			name='Test Questionnaire'
		)

		self.appointment = models.Appointment.objects.create(
			type=models.AppointmentType.objects.get(pk=1),
			patient=models.Patient.objects.create(first_name='John', last_name='Doe'),
			doctor=models.Doctor.objects.create(first_name='James', last_name='Pepper'),
			status=models.AppointmentStatus.objects.get(pk=2),
			start_date=datetime.datetime(year=2022, month=9, day=20, hour=12, tzinfo=datetime.timezone.utc),
			end_date = datetime.datetime(year=2022, month=9, day=20, hour=13, tzinfo=datetime.timezone.utc)
		)

		self.response = models.QuestionnaireResponse.objects.create(
			questionnaire=self.questionnaire,
			appointment=self.appointment
		)

		self.question = models.Question.objects.create(
			questionnaire=self.questionnaire,
			title='A Question',
			body='Is this working?',
			order=1,
			type=models.AnswerType.objects.get(pk=3)
		)

		self.answer = models.Answer.objects.create(
			response_for=self.response,
			question=self.question,
			response='A response!',
			alternate_response='An alternate response!'
		)


	def test_response_serialization(self):
		data = serializers.QuestionnaireResponse(self.response).data

		self.assertIsNotNone(data)
		self.assertIn('id', data)
		self.assertEqual(data.get('name', None), 'Test Questionnaire')

		appointment = data.get('appointment', None)

		self.assertIsNotNone(appointment)
		self.assertIn('id', appointment)
		self.assertEqual(appointment.get('start_date', None), '2022-09-20T12:00:00Z')
		self.assertEqual(appointment.get('status', None), 'Finished')

		doctor = appointment.get('doctor', None)

		self.assertIsNotNone(doctor)
		self.assertIn('id', doctor)
		self.assertEqual(doctor.get('first_name', None), 'James')
		self.assertEqual(doctor.get('last_name', None), 'Pepper')

		patient = appointment.get('patient', None)

		self.assertIsNotNone(patient)
		self.assertIn('id', patient)
		self.assertEqual(patient.get('first_name', None), 'John')
		self.assertEqual(patient.get('last_name', None), 'Doe')

		answers = data.get('answers', None)

		self.assertEqual(len(answers), 1)
		self.assertIn('id', answers[0])
		self.assertEqual(answers[0].get('response'), 'A response!')
		self.assertEqual(answers[0].get('alternate_response'), 'An alternate response!')

		question = answers[0]['question']

		self.assertIn('id', question)
		self.assertEqual(question.get('title', None), 'A Question')
		self.assertEqual(question.get('body', None), 'Is this working?')
		self.assertEqual(question.get('type', None), 'rating')


	def test_questionnaire_not_provided_on_create_raises_error(self):
		invalid_payload = {
			'appointment': {
				'id': self.appointment.id
			}
		}

		data = serializers.QuestionnaireResponse(data=invalid_payload)

		self.assertFalse(data.is_valid())
		self.assertEqual(
			str(data.errors['non_field_errors'][0]),
			'Provide a questionnaire to respond to.'
		)


	def test_answers_provided_on_create_raises_error(self):
		invalid_payload = {
			'questionnaire': {
				'id': self.questionnaire.id
			},
			'appointment': {
				'id': self.appointment.id
			},
			'answers': []
		}

		data = serializers.QuestionnaireResponse(data=invalid_payload)

		self.assertFalse(data.is_valid())
		self.assertEqual(
			str(data.errors['non_field_errors'][0]),
			'Answers not allowed on create.'
		)


	def test_answers_not_provided_on_update_raises_error(self):
		invalid_payload = {
			'questionnaire': {
				'id': self.questionnaire.id
			},
			'appointment': {
				'id': self.appointment.id
			},
		}

		data = serializers.QuestionnaireResponse(self.response, data=invalid_payload)

		self.assertFalse(data.is_valid())
		self.assertEqual(
			str(data.errors['non_field_errors'][0]),
			'Answers are required.'
		)


	def test_answers_provided_on_update_succeeds(self):
		valid_payload = {
			'questionnaire': {
				'id': self.questionnaire.id
			},
			'appointment': {
				'id': self.appointment.id
			},
			'answers': [
				{
					'id': self.answer.id,
					'question': {
						'id': self.question.id
					},
					'response': 'Test!',
					'alternate_response': 'Test again!'
				}
			]
		}

		data = serializers.QuestionnaireResponse(self.response, data=valid_payload)

		self.assertTrue(data.is_valid())
