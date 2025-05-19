from io import BytesIO
from PIL import Image
import torchvision.transforms as transforms
import torchvision.models as models
import torch.nn as nn   
import json

import torch
skin_conditions = [
    'acanthosis nigricans',
    'acne',
    'acne vulgaris',
    'acquired autoimmune bullous diseaseherpes gestationis',
    'acrodermatitis enteropathica',
    'actinic keratosis',
    'allergic contact dermatitis',
    'aplasia cutis',
    'basal cell carcinoma',
    'basal cell carcinoma morpheiform',
    'becker nevus',
    'behcets disease',
    'calcinosis cutis',
    'cheilitis',
    'congenital nevus',
    'dariers disease',
    'dermatofibroma',
    'dermatomyositis',
    'disseminated actinic porokeratosis',
    'drug eruption',
    'drug induced pigmentary changes',
    'dyshidrotic eczema',
    'eczema',
    'ehlers danlos syndrome',
    'epidermal nevus',
    'epidermolysis bullosa',
    'erythema annulare centrifigum',
    'erythema elevatum diutinum',
    'erythema multiforme',
    'erythema nodosum',
    'factitial dermatitis',
    'fixed eruptions',
    'folliculitis',
    'fordyce spots',
    'granuloma annulare',
    'granuloma pyogenic',
    'hailey hailey disease',
    'halo nevus',
    'hidradenitis',
    'ichthyosis vulgaris',
    'incontinentia pigmenti',
    'juvenile xanthogranuloma',
    'kaposi sarcoma',
    'keloid',
    'keratosis pilaris',
    'langerhans cell histiocytosis',
    'lentigo maligna',
    'lichen amyloidosis',
    'lichen planus',
    'lichen simplex',
    'livedo reticularis',
    'lupus erythematosus',
    'lupus subacute',
    'lyme disease',
    'lymphangioma',
    'malignant melanoma',
    'melanoma',
    'milia',
    'mucinosis',
    'mucous cyst',
    'mycosis fungoides',
    'myiasis',
    'naevus comedonicus',
    'necrobiosis lipoidica',
    'nematode infection',
    'neurodermatitis',
    'neurofibromatosis',
    'neurotic excoriations',
    'neutrophilic dermatoses',
    'nevocytic nevus',
    'nevus sebaceous of jadassohn',
    'papilomatosis confluentes and reticulate',
    'paronychia',
    'pediculosis lids',
    'perioral dermatitis',
    'photodermatoses',
    'pilar cyst',
    'pilomatricoma',
    'pityriasis lichenoides chronica',
    'pityriasis rosea',
    'pityriasis rubra pilaris',
    'porokeratosis actinic',
    'porokeratosis of mibelli',
    'porphyria',
    'port wine stain',
    'prurigo nodularis',
    'psoriasis',
    'pustular psoriasis',
    'pyogenic granuloma',
    'rhinophyma',
    'rosacea',
    'sarcoidosis',
    'scabies',
    'scleroderma',
    'scleromyxedema',
    'seborrheic dermatitis',
    'seborrheic keratosis',
    'solid cystic basal cell carcinoma',
    'squamous cell carcinoma',
    'stasis edema',
    'stevens johnson syndrome',
    'striae',
    'sun damaged skin',
    'superficial spreading melanoma ssm',
    'syringoma',
    'telangiectases',
    'tick bite',
    'tuberous sclerosis',
    'tungiasis',
    'urticaria',
    'urticaria pigmentosa',
    'vitiligo',
    'xanthomas',
    'xeroderma pigmentosum'
]

# Load the single image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
from PIL import Image
import requests

def predict_skin_condition(image_path, model_path = "/Users/krish/Desktop/SnapCare/backend/api/SKIN_MODEL", K=3):
    # Load and preprocess image
    full_path = "http://127.0.0.1:8000/media/" + image_path
    response = requests.get(full_path)
    response.raise_for_status()

    image_bytes = BytesIO(response.content)

    image = Image.open(image_bytes)
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension

    # Load model and update the classifier
    model = models.resnet50()
    model.fc = nn.Linear(in_features=model.fc.in_features, out_features=len(skin_conditions))
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()

    # Make prediction
    with torch.no_grad():
        output = model(image_tensor)
        probabilities = F.softmax(output, dim=1)
        top_probs, top_idxs = torch.topk(probabilities, K)

    # Map to classes
    top_probs = top_probs[0].tolist()
    top_idxs = top_idxs[0].tolist()
    top_classes = [skin_conditions[i] for i in top_idxs]
    
    with open('/Users/krish/Desktop/SnapCare/backend/api/skinConditions.json', 'r') as file:
        data = json.load(file)

    # Return results
    results = []
    for i in range(K):
        results.append([top_classes[i], top_probs[i], data[top_classes[i]]])
    
    return results