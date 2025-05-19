import json
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt 
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from . import preds

@csrf_exempt
@require_POST
def skinImage(request):
    image = request.FILES.get('image')

    if not image:
        return HttpResponseBadRequest('No image file found in request.')

    # Optional: Save the uploaded image (e.g., to media folder)
    file_path = default_storage.save('skin/' + image.name, ContentFile(image.read()))
    result = preds.predict_skin_condition(file_path)
    print(result)
    return JsonResponse({
        'status': 'success',
        'filename': image.name,
        'saved_to': file_path,
        'results': result
    })

@csrf_exempt
@require_POST
def eyeImage(request):
    image = request.FILES.get('image')

    if not image:
        return HttpResponseBadRequest('No image file found in request.')

    # Optional: Save the uploaded image (e.g., to media folder)
    file_path = default_storage.save('eye/' + image.name, ContentFile(image.read()))

    return JsonResponse({
        'status': 'success',
        'filename': image.name,
        'saved_to': file_path
    })