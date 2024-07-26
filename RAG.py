import json
import requests
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load the pre-trained model and tokenizer
tokenizer = AutoTokenizer.from_pretrained('mistralai/mistral-7b-v0.1')
model = AutoModelForCausalLM.from_pretrained('mistralai/mistral-7b-v0.1')

# Function to get the vector for a given text
def get_vector(text):
    inputs = tokenizer(text, return_tensors='pt', max_length=1024, truncation=True, padding='max_length')
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().tolist()

# Function to query Elasticsearch
def query_elasticsearch(query_vector):
    es_query = {
        "size": 1,
        "_source": ["subject", "email_text", "delivered-to", "from", "date"],
        "query": {
            "bool": {
                "should": [
                    {"knn": {"field": "subject_vector", "query_vector": query_vector, "num_candidates": 1}},
                    {"knn": {"field": "from_vector", "query_vector": query_vector, "num_candidates": 1}},
                    {"knn": {"field": "email_text_vector", "query_vector": query_vector, "num_candidates": 1}},
                    {"knn": {"field": "date_vector", "query_vector": query_vector, "num_candidates": 1}},
                    {"knn": {"field": "delivered_to_vector", "query_vector": query_vector, "num_candidates": 1}}
                ]
            }
        }
    }
    url = 'http://localhost:9200/vector/_search'
    response = requests.post(url, json=es_query)
    return response.json()

# Function to get response from Hugging Face model
def get_mistral_response(prompt, context):
    # Prepare input for the model
    input_text = f"Context: {context}\nPrompt: {prompt}\nResponse:"
    inputs = tokenizer(input_text, return_tensors='pt', max_length=1024, truncation=True, padding='max_length')

    # Generate response
    with torch.no_grad():
        outputs = model.generate(inputs.input_ids, max_length=1024)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response_text

# Main function to handle user prompt and generate response
def main():
    # Get user prompt
    user_prompt = input("Enter your prompt: ")

    # Query text
    query_text = user_prompt
    query_vector = get_vector(query_text)

    # Query Elasticsearch
    es_response = query_elasticsearch(query_vector)

    # Extract relevant context from Elasticsearch results
    context = ""
    if 'hits' in es_response and 'hits' in es_response['hits'] and len(es_response['hits']['hits']) > 0:
        doc = es_response['hits']['hits'][0]['_source']
        context = f"Subject: {doc['subject']}\nFrom: {doc['from']}\nTo: {doc['delivered-to']}\nDate: {doc['date']}\nEmail: {doc['email_text']}"

    # Get response from Mistral AI
    mistral_response = get_mistral_response(user_prompt, context)

    # Print the response
    print("Mistral AI Response:")
    print(mistral_response)

if __name__ == "__main__":
    main()
