from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

import api.models as models
import api.serializers as serializers


class Appointment(APIView):
    def get(self, request, appointment_id, format=None):
        appointment = get_object_or_404(models.Appointment.objects.all(), pk=appointment_id)

        return Response(serializers.Appointment(appointment).data)


class Questionnaire(APIView):
    def get(self, request, questionnaire_id, format=None):
        questionnaire = get_object_or_404(models.Questionnaire.objects.all(), pk=questionnaire_id)

        return Response(serializers.Questionnaire(questionnaire).data)


class QuestionnaireResponse(APIView):
    def post(self, request, response_id, format=None):
        response = self._get_response(response_id)

        data = serializers.QuestionnaireResponse(response, data=request.data)
        if data.is_valid():
            response = serializers.QuestionnaireResponse(data.save())
            return Response(response.data)

        return Response(data.errors, status=HTTP_400_BAD_REQUEST)


    def get(self, request, response_id, format=None):
        response = self._get_response(response_id)

        return Response(serializers.QuestionnaireResponse(response).data)


    def _get_response(self, response_id):
        return get_object_or_404(models.QuestionnaireResponse.objects.all(), pk=response_id)


class CreateQuestionnaireResponse(APIView):
    def post(self, request, format=None):
        data = serializers.QuestionnaireResponse(data=request.data)

        if data.is_valid():
            response = serializers.QuestionnaireResponse(data.save())
            return Response(response.data)

        return Response(data.errors, status=400)