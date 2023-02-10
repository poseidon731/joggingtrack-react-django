from .models import User
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import IsAdminOrManager


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = [IsAdminOrManager]

    def get_serializer_class(self):
        if self.request.method in ['POST']:
            return UserCreateSerializer
        elif self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        else:
            # Default for get and other requests is the read only serializer
            return UserSerializer

    def get_queryset(self):
        qs = super(UserViewSet, self).get_queryset()
        return qs.filter_by_user(self.request.user)

    @list_route(methods=['put', 'get'], permission_classes=[IsAuthenticated,], url_path='profile')
    def profile(self, request, *args, **kwargs):
        SerializerClass = self.get_serializer_class()
        if request.method in ['PUT']:
            serializer = SerializerClass(instance=request.user, data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            serializer = SerializerClass(instance=request.user)
        return Response(serializer.data)

    @detail_route(methods=['get'], permission_classes=[IsAuthenticated,], url_path='report')
    def report(self, request, *args, **kwargs):
        user = self.get_object()
        date_from = self.request.query_params.get('from', None)
        date_to = self.request.query_params.get('to', None)
        return Response(user.get_report(date_from=date_from, date_to=date_to))
