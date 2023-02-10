from .models import Record
from rest_framework import serializers

class RecordSerializer(serializers.ModelSerializer):
    user_fullname = serializers.SerializerMethodField()

    def get_user_fullname(self, obj):
        return obj.user.get_full_name()

    class Meta:
        model = Record
        fields = ('id', 'date_recorded', 'distance', 'duration', 'user', 'user_fullname')
        read_only_fields = ('user_fullname',)
