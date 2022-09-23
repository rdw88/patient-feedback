import rest_framework.serializers as serializers

import api.models as models


class Doctor(serializers.ModelSerializer):
	class Meta:
		model = models.Doctor
		fields = ('id', 'first_name', 'last_name',)


class Patient(serializers.ModelSerializer):
	class Meta:
		model = models.Patient
		fields = ('id', 'first_name', 'last_name',)


class Appointment(serializers.ModelSerializer):
	doctor = Doctor(read_only=True)
	patient = Patient(read_only=True)
	status = serializers.CharField(source='status.name', read_only=True)

	class Meta:
		model = models.Appointment
		fields = ('id', 'start_date', 'doctor', 'patient', 'status')
		read_only_fields = ('start_date', 'doctor', 'patient', 'status')
		extra_kwargs = {
			'id': {
				'read_only': False,
				'required': False
			}
		}


class Question(serializers.ModelSerializer):
	type = serializers.CharField(source='type.name', read_only=True)
	body = serializers.SerializerMethodField()


	def get_body(self, question):
		appointment = self.context.get('appointment', None)

		# Question is serialized without an Appointment context. This occurs
		# if this object is being viewed during configuration where the admin
		# would want to see [Variable Placeholders]
		if not appointment:
			return question.body

		# This could be further expanded to allow a provider to choose
		# where these placeholders are derived from.
		body = question.body.replace('[Patient First Name]', appointment.patient.first_name)
		body = body.replace('[Doctor Last Name]', appointment.doctor.last_name)

		diagnosis = appointment.diagnoses.first()
		if not diagnosis:
			return body

		return body.replace('[Diagnosis]', diagnosis.condition.name)


	def to_representation(self, response):
		if self.parent:
			self.context['appointment'] = self.parent.context.get('appointment', None)

		return super().to_representation(response)


	class Meta:
		model = models.Question
		fields = ('id', 'title', 'body', 'type',)
		read_only_fields = ('title', 'body', 'type',)
		extra_kwargs = {
			'id': {
				'read_only': False,
				'required': False
			}
		}


class Questionnaire(serializers.ModelSerializer):
	questions = Question(many=True, read_only=True)

	class Meta:
		model = models.Questionnaire
		fields = ('id', 'name', 'questions',)
		read_only_fields = ('name', 'questions',)
		extra_kwargs = {
			'id': {
				'read_only': False,
				'required': False
			}
		}


class Answer(serializers.ModelSerializer):
	question = Question()
	alternate_response = serializers.CharField(required=False, allow_blank=True)


	def to_representation(self, response):
		if self.parent:
			self.context['appointment'] = self.parent.context.get('appointment', None)

		return super().to_representation(response)


	class Meta:
		model = models.Answer
		fields = ('id', 'question', 'response', 'alternate_response')
		extra_kwargs = {
			'id': {
				'read_only': False,
				'required': False
			}
		}


class QuestionnaireResponse(serializers.ModelSerializer):
	name = serializers.SerializerMethodField()
	questionnaire = Questionnaire(required=False, write_only=True)
	answers = Answer(required=False, many=True)
	appointment = Appointment()


	def get_name(self, response):
		return response.questionnaire.name


	def validate(self, data):
		"""
		If a new QuestionnaireResponse instance is being created, the client
		must specify a Questionnaire to respond to.
		"""
		if 'questionnaire' not in data and self.instance is None:
			raise serializers.ValidationError('Provide a questionnaire to respond to.')

		# For demo purposes, creating a QuestionnaireResponse is just to have
		# an instance to work with. These instances could be created by a background
		# process when the Patient's Appointment changes status from "In Progress" to
		# "Finished" as opposed to having a REST endpoint.
		if 'answers' in data and self.instance is None:
			raise serializers.ValidationError('Answers not allowed on create.')

		if 'answers' not in data and self.instance is not None:
			raise serializers.ValidationError('Answers are required.')

		return data


	def validate_appointment(self, appointment):
		pk = appointment['id']

		if not models.Appointment.objects.filter(pk=pk).exists():
			raise serializers.ValidationError(f'Appointment {pk} not found')

		return appointment


	def validate_questionnaire(self, questionnaire):
		pk = questionnaire['id']

		if not models.Questionnaire.objects.filter(pk=pk).exists():
			raise serializers.ValidationError(f'Questionnaire {pk} not found')

		return questionnaire


	def validate_answers(self, answers):
		# Only validate on update
		if not self.instance:
			return answers

		submitted_ids = [answer['id'] for answer in answers]
		existing_answers = list(self.instance.answers.all().values_list('id', flat=True))

		if submitted_ids != existing_answers:
			raise serializers.ValidationError('Invalid answer provided for questionnaire')

		return answers 


	def create(self, validated_data):
		appointment = models.Appointment.objects.get(pk=validated_data['appointment']['id'])
		questionnaire = models.Questionnaire.objects.get(pk=validated_data['questionnaire']['id'])

		response = models.QuestionnaireResponse.objects.create(
			appointment=appointment,
			questionnaire=questionnaire
		)

		for question in questionnaire.questions.all():
			models.Answer.objects.create(
				response_for=response,
				question=question,
				response='',
				alternate_response=''
			)

		return response


	def update(self, response, validated_data):
		for answer in validated_data['answers']:
			response.answers.filter(
				id=answer['id']
			).update(
				response=answer['response'],
				alternate_response=answer.get('alternate_response', '')
			)

		return response


	def to_representation(self, response):
		self.context['appointment'] = response.appointment
		return super().to_representation(response)


	class Meta:
		model = models.QuestionnaireResponse
		fields = ('id', 'name', 'questionnaire', 'appointment', 'answers',)
		read_only_fields = ('id', 'name',)
