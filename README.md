# Patient Feedback

An app that prompts a patient for feedback on their most recent appointment.

## Running API

The API can be run locally by running:

```
cd api/
docker compose up
```

### Setup Data

Create a new QuestionnaireResponse for a pre-seeded Questionnaire and Appointment:
```
POST /responses
{
    "questionnaire": {
        "id": 1
    },
    "appointment": {
        "id": 1
    }
}
```

## Running Front-End

```
cd web/
npm install
npm start
```

Navigate to http://localhost:3000/responses/1

**Note:** The "1" in the URL represents the id returned from the QuestionnaireResponse created in the setup data section. You can create more responses and navigate to the appropriate endpoint.
