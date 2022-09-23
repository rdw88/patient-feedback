FROM python:3.9.5-buster

RUN echo "\ndeb https://nginx.org/packages/debian/ buster nginx\n" >> /etc/apt/sources.list\
    && echo "deb-src https://nginx.org/packages/debian/ buster nginx\n" >> /etc/apt/sources.list\
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62\
    && apt-get update\
    && apt-get install -y nginx=1.18.0-2~buster\
    && rm -rf /var/lib/apt/lists/*\
    && mkdir /patient_feedback\
    && mkdir /patient_feedback/logs\
    && chown -R nginx:nginx /patient_feedback/logs\
    && chmod g+s /patient_feedback/logs

WORKDIR /patient_feedback

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY api/ api/
COPY patientfeedback/ patientfeedback/
COPY init uwsgi_conf.ini manage.py ./
COPY nginx.conf /etc/nginx/nginx.conf
COPY .bashrc /root

COPY secrets/* secrets/

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["./init"]
