from django.db import models
from django.db.models import Sum, Avg, Min, Max
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import BaseUserManager
from django.utils.functional import cached_property
from datetime import date, timedelta
from math import ceil

# Create your models here.
ROLE_CHOICES = (
    (u'admin', u'Admin'),
    (u'manager', u'Manager'),
    (u'user', u'User'),
)


class UserQuerySet(models.QuerySet):
    def filter_by_user(self, user):
        if user.is_admin:
            return self.filter(role__in=['admin', 'manager', 'user'])
        if user.is_manager:
            return self.filter(role__in=['manager', 'user'])
        else:
            return self.filter(pk=user.pk)


class UserManager(BaseUserManager):
    """
    A custom user manager to deal with emails as unique identifiers for auth
    instead of usernames. The default that's used is "UserManager"
    """
    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(email, password, **extra_fields)

    def get_queryset(self):
        return UserQuerySet(self.model, using=self._db)

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_('First Name'), max_length=50)
    last_name = models.CharField(_('Last Name'), max_length=50)
    email = models.EmailField(_('Email address'), unique=True)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='user')
    is_superuser = models.BooleanField(_('superuser status'), default=False)
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_active = models.BooleanField(_('active'), default=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    USERNAME_FIELD = 'email'
    objects = UserManager()

    @cached_property
    def is_admin(self):
        return self.role == 'admin'

    @cached_property
    def is_manager(self):
        return self.role == 'manager'

    @cached_property
    def is_user(self):
        return self.role == 'user'

    def __str__(self):
        return self.email
    
    def get_short_name(self):
        return self.first_name

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_report(self, date_from, date_to):
        qs = self.records.all()
        if date_from is not None:
            qs = qs.filter(date_recorded__gte=date_from)
        if date_to is not None:
            qs = qs.filter(date_recorded__lte=date_to)

        agg_res = qs.aggregate(
            total_distance=Sum('distance'),
            total_duration=Sum('duration'),
            first_date_recorded=Min('date_recorded'),
            last_date_recorded=Max('date_recorded')
        )
        total_distance = agg_res['total_distance'] or 0
        total_duration = agg_res['total_duration'] or 1
        first_date_recorded = agg_res['first_date_recorded'] or date.today()
        last_date_recorded = agg_res['last_date_recorded'] or date.today()

        week_start = first_date_recorded.isocalendar()[1] + first_date_recorded.isocalendar()[0] * 366
        week_end = last_date_recorded.isocalendar()[1] + last_date_recorded.isocalendar()[0] * 366
        sums = {}
        for week in range(week_start, week_end + 1):
            sums[week] = {
                'distance': 0,
                'duration': 0
            }

        for item in qs:
            isocal = item.date_recorded.isocalendar()
            week = isocal[1] + isocal[0] * 366
            sums[week]['distance'] += item.distance
            sums[week]['duration'] += item.duration

        weekly = []
        for week in range(week_start, week_end + 1):
            if sums[week]['distance'] != 0 and sums[week]['duration'] != 0:
                week_of_year = week % 366
                year = int(week / 366)
                first_date_of_year = date(year, 1, 1)
                first_week_day_of_year = first_date_of_year - timedelta(first_date_of_year.isocalendar()[2] - 1)
                week_start = first_week_day_of_year + timedelta(weeks=week_of_year)
                weekly.append({
                    'distance': sums[week]['distance'],
                    'avg_speed': sums[week]['distance'] / sums[week]['duration'],
                    'from': week_start,
                    'to': week_start + timedelta(days=6)
                })

        date_diff = (last_date_recorded - first_date_recorded).days + 1
        weeks = ceil(date_diff / 7) or 1

        return {
            'avg_speed': total_distance / total_duration,
            'distance_per_week': total_distance / weeks,
            'weekly': weekly
        }
