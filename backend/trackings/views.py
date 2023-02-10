from .models import Record
from .serializers import RecordSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class RecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Record.objects.all().order_by('-date_recorded')
    permission_classes = [IsAuthenticated]
    serializer_class = RecordSerializer

    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_queryset(self):
        qs = super(RecordViewSet, self).get_queryset()
        date_from = self.request.query_params.get('from', None)
        date_to = self.request.query_params.get('to', None)
        if date_from is not None:
            qs = qs.filter(date_recorded__gte=date_from)
        if date_to is not None:
            qs = qs.filter(date_recorded__lte=date_to)

        return qs.filter_by_user(self.request.user)
