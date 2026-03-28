from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Avg
from .models import Training
from .serializers import TrainingSerializer
from rest_framework.permissions import AllowAny

class TrainingViewSet(viewsets.ModelViewSet):
    queryset = Training.objects.all().order_by('-start_date')
    serializer_class = TrainingSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def completed(self, request):
        queryset = self.get_queryset().filter(completion_status='Completed')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        today = timezone.now().date()
        queryset = self.get_queryset().filter(due_date__lt=today).exclude(completion_status='Completed')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_trainings = Training.objects.count()
        completed_trainings = Training.objects.filter(completion_status='Completed').count()
        avg_completion_rate = int((completed_trainings / total_trainings * 100) if total_trainings > 0 else 0)
        
        today = timezone.now().date()
        overdue_count = Training.objects.filter(due_date__lt=today).exclude(completion_status='Completed').count()
        
        avg_feedback_data = Training.objects.filter(feedback_rating__isnull=False).aggregate(avg=Avg('feedback_rating'))
        avg_feedback = round(avg_feedback_data['avg'] or 0, 1)
        
        user = request.user
        if user.is_authenticated:
            my_pending = Training.objects.filter(assigned_to=user).exclude(completion_status='Completed').count()
            my_completed = Training.objects.filter(assigned_to=user, completion_status='Completed').count()
        else:
            my_pending = 0
            my_completed = 0
        
        data = {
            'totalTrainings': total_trainings,
            'avgCompletionRate': avg_completion_rate,
            'overdueCount': overdue_count,
            'avgFeedback': avg_feedback,
            'myPending': my_pending,
            'myCompleted': my_completed
        }
        return Response(data)
