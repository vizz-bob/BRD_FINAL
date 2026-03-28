from django import forms
from .models import Meeting

class MeetingForm(forms.ModelForm):
    class Meta:
        model = Meeting
        fields = [
            'meeting_type', 'meeting_mode', 'lead', 'title', 
            'datetime', 'duration', 'link', 'priority', 
            'assigned_to', 'agenda'
        ]
        widgets = {
            'datetime': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
            'agenda': forms.Textarea(attrs={'rows': 3}),
        }
