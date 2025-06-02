import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load the new dataset
data_path = 'dataset/healthcare_bot_dataset_extended.csv'
df = pd.read_csv(data_path)

# Data Cleaning: Remove any rows with missing data
df = df.dropna()

# Combine 'Symptoms' and 'Disease' for better text matching
df['combined_text'] = df['Disease'] + " " + df['Symptoms']

# Vectorize the dataset (using combined_text)
vectorizer = TfidfVectorizer(stop_words='english')
vectors = vectorizer.fit_transform(df['combined_text'])

# Store conversation context
conversation_context = {}

# Initial Greeting Message
initial_message = (
    "👋 Hi! I'm Medibot, your healthcare companion. "
    "I can help you with symptom diagnosis, causes, treatments, and precautions. "
    "How may I assist you today? 😊"
)

# Thank You Response
thank_you_message = (
    "You're welcome! 😊 "
    "I'm glad I could help.\n\n"
    "🚑 Need further help? If you want to find nearby hospitals or pharmacies, "
    "you can access the Nearby Services feature provided by MEDIBIOTIC. 🏨💊"
)

# Function to find the best match using cosine similarity
def get_best_match(user_input):
    user_vector = vectorizer.transform([user_input])
    similarity = cosine_similarity(user_vector, vectors)
    best_match_idx = similarity.argmax()
    best_score = similarity.max()

    # Check threshold for relevance
    if best_score > 0.3:
        # Fetch full response for the matched disease
        disease = df.iloc[best_match_idx]['Disease']
        symptoms = df.iloc[best_match_idx]['Symptoms']
        causes = df.iloc[best_match_idx]['Causes']
        treatment = df.iloc[best_match_idx]['Treatment']
        precautions = df.iloc[best_match_idx]['Precautions']

        # Store in context for later retrieval
        conversation_context['disease'] = disease
        conversation_context['symptoms'] = symptoms
        conversation_context['causes'] = causes
        conversation_context['treatment'] = treatment
        conversation_context['precautions'] = precautions

        # Initial response after diagnosis
        return (f"🩺 I suspect you might be experiencing {disease}\n"
                "Would you like to know about symptoms, causes, treatment, or precautions? "
                "You can ask for any of these specifically. 😊")
    else:
        return "I'm not sure. Please provide more details or consult a doctor."

# Symptom Diagnosis Route
@app.route('/symptom-diagnosis', methods=['POST'])
def symptom_diagnosis():
    data = request.get_json()
    symptom_input = data.get('symptom', 'Unknown').strip().lower()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # List of greeting keywords
    greeting_keywords = ["hi", "hello", "hey", "start", "help"]
    thank_you_keywords = ["thank you", "thanks", "thx", "thankyou"]

    # Check if the message is a greeting
    if symptom_input in greeting_keywords:
        response = initial_message
    # Check if the user is saying thanks
    elif symptom_input in thank_you_keywords:
        response = thank_you_message
    elif 'symptoms' in symptom_input:
        response = f"🤒 Symptoms: {conversation_context.get('symptoms', 'No data available.')}"
    elif 'causes' in symptom_input:
        response = f"📢 Causes:  {conversation_context.get('causes', 'No data available.')}"
    elif 'treatment' in symptom_input:
        response = f"💊 Treatment: {conversation_context.get('treatment', 'No data available.')}"
    elif 'precautions' in symptom_input:
        response = f"🛡️ Precautions: {conversation_context.get('precautions', 'No data available.')}"
    else:
        # If it's a new query or follow-up
        response = get_best_match(symptom_input)

    # Log entry (optional)
    log_entry = {
        "timestamp": timestamp,
        "symptom": symptom_input,
        "response": response
    }
    print(f"Log Entry: {log_entry}")  # For debugging/logging

    return jsonify({"message": response})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
