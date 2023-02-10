from django.contrib.auth.models import update_last_login
from rest_framework import status, parsers, renderers
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.utils import jwt_response_payload_handler
from user.models import User
from user.serializers import UserSerializer, UserCreateSerializer


class LoginView(APIView):
    throttle_classes = ()
    permission_classes = ()
    authentication_classes = ()
    parser_classes = (parsers.FormParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = JSONWebTokenSerializer

    def post(self, request):
        """
        User login view.

        Based on JSONWebTokenAPIView from rest_framework_jwt.
        """
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            token = serializer.object.get('token')
            response_data = jwt_response_payload_handler(token, user, request)
            response_data['info'] = UserSerializer(user).data
            update_last_login(None, user)
            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(CreateModelMixin, GenericAPIView):
    serializer_class = UserCreateSerializer
    authentication_classes = ()

    def post(self, request):
        """User registration view."""
        return self.create(request)
