from django.contrib import admin
from django.urls import path

import api.views as views

urlpatterns = [
    path('appointments/<int:appointment_id>', views.Appointment.as_view()),

    path('questionnaires/<int:questionnaire_id>', views.Questionnaire.as_view()),

    path('responses/<int:response_id>', views.QuestionnaireResponse.as_view()),
    path('responses', views.CreateQuestionnaireResponse.as_view()),
]
