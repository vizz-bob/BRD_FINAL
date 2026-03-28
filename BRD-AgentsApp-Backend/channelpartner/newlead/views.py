from rest_framework import views, permissions, response, status, generics
from django.db.models import Q
import re
from channelpartner.leads.models import Lead, LeadActivity
from channelpartner.leads.serializers import LeadSerializer
from .models import LeadScan, NewLeadRequest
from .serializers import NewLeadRequestSerializer, ProductTypeChoicesSerializer
import logging

logger = logging.getLogger(__name__)

class OCRPanView(views.APIView):
    """
    Extract PAN number from image
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return response.Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            import pytesseract
            from PIL import Image
            image = Image.open(file)
            text = pytesseract.image_to_string(image)
            
            # Improved PAN regex
            match = re.search(r'[A-Z]{5}[0-9]{4}[A-Z]{1}', text.upper())
            pan = match.group(0) if match else None
            
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            name = None
            if len(lines) > 0:
                for line in lines[:5]:
                    if re.match(r'^[A-Z\s]+$', line.upper()) and len(line) > 3:
                        name = line.title()
                        break

            # Log the scan
            LeadScan.objects.create(
                user=request.user,
                scan_type='PAN',
                image=file,
                raw_text=text,
                extracted_data={'pan': pan, 'name': name},
                success=bool(pan)
            )

            return response.Response({
                'pan': pan, 
                'name': name,
                'raw_text': text
            })
        except Exception as e:
            logger.error(f"OCR PAN failed: {str(e)}")
            LeadScan.objects.create(
                user=request.user,
                scan_type='PAN',
                image=file,
                success=False,
                raw_text=str(e)
            )
            return response.Response({'error': f"Processing failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class OCRAadhaarView(views.APIView):
    """
    Extract Aadhaar number from image
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return response.Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            import pytesseract
            from PIL import Image
            image = Image.open(file)
            text = pytesseract.image_to_string(image)
            
            aadhaar_regex = r'\b\d{4}\s?\d{4}\s?\d{4}\b'
            match = re.search(aadhaar_regex, text)
            aadhaar = match.group(0).replace(' ', '') if match else None
            
            # Log the scan
            LeadScan.objects.create(
                user=request.user,
                scan_type='AADHAAR',
                image=file,
                raw_text=text,
                extracted_data={'aadhaar': aadhaar},
                success=bool(aadhaar)
            )

            return response.Response({
                'aadhaar': aadhaar, 
                'raw_text': text
            })
        except Exception as e:
            logger.error(f"OCR Aadhaar failed: {str(e)}")
            LeadScan.objects.create(
                user=request.user,
                scan_type='AADHAAR',
                image=file,
                success=False,
                raw_text=str(e)
            )
            return response.Response({'error': f"Processing failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class CreateLeadView(generics.CreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'PARTNER':
            from django.core.exceptions import ValidationError
            raise ValidationError("Only partners can create leads")
        
        lead = serializer.save(partner=self.request.user, status='ACTIVE')
        
        # Link latest scan to this lead if possible (session/matching based)
        try:
            from .models import LeadScan
            latest_scan = LeadScan.objects.filter(
                user=self.request.user,
                success=True,
                lead__isnull=True
            ).filter(
                Q(extracted_data__pan=lead.pan) | Q(extracted_data__aadhaar=lead.aadhaar)
            ).first()
            if latest_scan:
                latest_scan.lead = lead
                latest_scan.save()
        except:
            pass

        LeadActivity.objects.create(
            lead=lead,
            user=self.request.user,
            activity_type='CREATED',
            description=f"New Lead {lead.lead_id} created via Quick Lead module"
        )

class ProductListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        products = [
            {'id': 'personal_loan', 'name': 'Personal Loan'},
            {'id': 'business_loan', 'name': 'Business Loan'},
            {'id': 'home_loan', 'name': 'Home Loan'},
            {'id': 'car_loan', 'name': 'Car Loan'},
            {'id': 'education_loan', 'name': 'Education Loan'},
            {'id': 'gold_loan', 'name': 'Gold Loan'},
        ]
        return response.Response(products)

class GuidelineView(views.APIView):
    """
    Get the disclaimer/consent text for the form
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import LeadConsent
        consent = LeadConsent.objects.filter(is_active=True).first()
        if not consent:
            return response.Response({
                'title': 'Lead Verification & Approval',
                'content': 'All leads are subject to verification and approval. You\'ll be notified of any status changes.'
            })
        return response.Response({
            'title': consent.title,
            'content': consent.content
        })

class RequirementsView(views.APIView):
    """
    Get document requirements for a specific product
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import LeadRequirement
        product_id = request.query_params.get('product_id')
        if not product_id:
            return response.Response({'error': 'Product ID required'}, status=400)
            
        req = LeadRequirement.objects.filter(product_type=product_id).first()
        if not req:
            return response.Response({
                'required_documents': ['PAN', 'Aadhaar', 'Income Proof'],
                'minimum_amount': 50000
            })
        return response.Response({
            'required_documents': req.required_documents,
            'minimum_amount': float(req.minimum_amount),
            'instructions': req.instructions
        })

class CreateNewLeadRequestView(generics.CreateAPIView):
    """
    Create a new lead request with personal and loan details
    """
    serializer_class = NewLeadRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NewLeadRequest.objects.all()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ListNewLeadRequestView(generics.ListAPIView):
    """
    List all new lead requests
    """
    serializer_class = NewLeadRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NewLeadRequest.objects.all()
    
    def get_queryset(self):
        # Users can see their own requests
        user = self.request.user
        return NewLeadRequest.objects.filter(created_by=user)


class RetrieveNewLeadRequestView(generics.RetrieveAPIView):
    """
    Get details of a specific new lead request
    """
    serializer_class = NewLeadRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NewLeadRequest.objects.all()
    lookup_field = 'id'


class UpdateNewLeadRequestView(generics.UpdateAPIView):
    """
    Update a new lead request
    """
    serializer_class = NewLeadRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = NewLeadRequest.objects.all()
    lookup_field = 'id'
    
    def get_queryset(self):
        # Users can only update their own requests
        user = self.request.user
        return NewLeadRequest.objects.filter(created_by=user)


class DeleteNewLeadRequestView(generics.DestroyAPIView):
    """
    Delete a new lead request
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = NewLeadRequest.objects.all()
    lookup_field = 'id'
    
    def get_queryset(self):
        # Users can only delete their own requests
        user = self.request.user
        return NewLeadRequest.objects.filter(created_by=user)


class ProductTypeChoicesView(views.APIView):
    """
    Get available product type choices for dropdown
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Return available product type choices"""
        choices = [
            {'value': choice[0], 'label': choice[1]}
            for choice in NewLeadRequest.PRODUCT_TYPE_CHOICES
        ]
        return response.Response({
            'product_types': choices,
            'total': len(choices)
        })