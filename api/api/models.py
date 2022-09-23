from django.db import models


class User(models.Model):
	first_name = models.CharField(max_length=256)
	last_name = models.CharField(max_length=256)

	class Meta:
		abstract = True


class Patient(User):
	pass


class Doctor(User):
	pass


class Appointment(models.Model):
	type = models.ForeignKey('AppointmentType', on_delete=models.DO_NOTHING)
	patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
	doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
	status = models.ForeignKey('AppointmentStatus', on_delete=models.DO_NOTHING)
	start_date = models.DateTimeField()
	end_date = models.DateTimeField()


class AppointmentType(models.Model):
	name = models.CharField(max_length=256)


class AbstractStatus(models.Model):
	code = models.CharField(max_length=32)
	name = models.CharField(max_length=256)

	class Meta:
		abstract = True


class AppointmentStatus(AbstractStatus):
	pass


class Diagnosis(models.Model):
	discovered_during = models.ForeignKey(Appointment, related_name='diagnoses', on_delete=models.CASCADE)
	condition = models.ForeignKey('Condition', on_delete=models.DO_NOTHING)
	status = models.ForeignKey('DiagnosisStatus', on_delete=models.DO_NOTHING)


class DiagnosisStatus(AbstractStatus):
	pass


class Condition(models.Model):
	code = models.CharField(max_length=32)
	name = models.CharField(max_length=256)


class Questionnaire(models.Model):
	name = models.CharField(max_length=256)


class Question(models.Model):
	questionnaire = models.ForeignKey(Questionnaire, related_name='questions', on_delete=models.CASCADE)
	title = models.CharField(max_length=256)
	body = models.TextField()
	order = models.PositiveIntegerField()
	type = models.ForeignKey('AnswerType', on_delete=models.DO_NOTHING)

	class Meta:
		ordering = ('order',)


class QuestionnaireResponse(models.Model):
	questionnaire = models.ForeignKey(Questionnaire, related_name='responses', on_delete=models.CASCADE)
	appointment = models.ForeignKey(Appointment, related_name='questionnaire_responses', on_delete=models.CASCADE)


class AnswerType(models.Model):
	name = models.CharField(max_length=32)


class Answer(models.Model):
	response_for = models.ForeignKey(QuestionnaireResponse, related_name='answers', on_delete=models.CASCADE)
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	response = models.TextField()
	alternate_response = models.TextField()
