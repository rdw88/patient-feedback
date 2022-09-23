# Generated by Django 3.1.7 on 2022-09-23 00:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20220922_0532'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response', models.TextField()),
                ('alternate_response', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.question')),
            ],
        ),
        migrations.RenameModel(
            old_name='QuestionAnswerType',
            new_name='AnswerType',
        ),
        migrations.RemoveField(
            model_name='questionresponse',
            name='responds_to',
        ),
        migrations.RemoveField(
            model_name='questionresponse',
            name='response_for',
        ),
        migrations.RenameField(
            model_name='questionnaireresponse',
            old_name='responds_to',
            new_name='questionnaire',
        ),
        migrations.DeleteModel(
            name='QuestionAnswerOption',
        ),
        migrations.DeleteModel(
            name='QuestionResponse',
        ),
        migrations.AddField(
            model_name='answer',
            name='response_for',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='api.questionnaireresponse'),
        ),
    ]
