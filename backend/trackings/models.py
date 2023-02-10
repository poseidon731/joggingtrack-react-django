from django.db import models

class RecordQuerySet(models.QuerySet):
    def filter_by_user(self, user):
        if user.is_admin:
            return self
        if user.is_manager:
            return self.exclude(user__role='admin')
        else:
            return self.filter(user=user)


class Record(models.Model):
    user = models.ForeignKey('user.User', related_name='records', on_delete=models.CASCADE)
    date_recorded = models.DateField(help_text='Recorded date')
    duration = models.IntegerField(help_text='Jogging duration in seconds')
    distance = models.FloatField(help_text='Jogging distance')
    objects = RecordQuerySet.as_manager()

    def __str__(self):
        return '{}::{}'.format(self.user, self.date_recorded)
