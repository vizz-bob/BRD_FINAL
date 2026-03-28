# from rest_framework.generics import (
#     CreateAPIView,
#     ListAPIView,
#     UpdateAPIView,
#     DestroyAPIView,
# )
# from .models import ThirdPartyUser
# from .serializers import ThirdPartyUserSerializer


# class CreatePartner(CreateAPIView):
#     queryset = ThirdPartyUser.objects.all()
#     serializer_class = ThirdPartyUserSerializer


# class ListPartners(ListAPIView):
#     queryset = ThirdPartyUser.objects.all()
#     serializer_class = ThirdPartyUserSerializer


# class UpdatePartner(UpdateAPIView):
#     queryset = ThirdPartyUser.objects.all()
#     serializer_class = ThirdPartyUserSerializer


# class DeletePartner(DestroyAPIView):
#     queryset = ThirdPartyUser.objects.all()
#     serializer_class = ThirdPartyUserSerializer



from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
)
from .models import ThirdPartyUser
from .serializers import ThirdPartyUserSerializer


class ListPartners(ListAPIView):
    queryset = ThirdPartyUser.objects.select_related("user")
    serializer_class = ThirdPartyUserSerializer


class CreatePartner(CreateAPIView):
    queryset = ThirdPartyUser.objects.all()
    serializer_class = ThirdPartyUserSerializer


class UpdatePartner(UpdateAPIView):
    queryset = ThirdPartyUser.objects.all()
    serializer_class = ThirdPartyUserSerializer


class DeletePartner(DestroyAPIView):
    queryset = ThirdPartyUser.objects.all()
    serializer_class = ThirdPartyUserSerializer
