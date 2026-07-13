from supabase import create_client
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

SUPABASE_URL = "https://jmatvwlkpblueegafkqg.supabase.co"
SUPABASE_KEY = "sb_secret__GcewNP-jLzvJWGcRL3JLQ_nHPsfheS"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Loading embedding model...")
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

print("Loading Billy (Llama 3.1 8B)...")
model_path = "models/Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16, device_map="auto")

print("Billy is ready! Ask anything about DePaul Financial Aid, or type quit to exit.")

while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        break

    query_embedding = embed_model.encode(user_input).tolist()

    result = supabase.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_count": 3
    }).execute()

    context = ""
    for doc in result.data:
        context += "[Source: " + doc["url"] + "]\n" + doc["content"] + "\n\n"

    messages = [
        {"role": "system", "content": "You are Billy, DePaul University's financial aid assistant. Only answer using the information below. Cite the source URL when relevant. If the answer is not in the information given, say you are not confident and recommend contacting the Office of Financial Aid.\n\nRelevant DePaul Information:\n" + context},
        {"role": "user", "content": user_input}
    ]

    inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=200)
    answer = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)

    print("Billy: " + answer)
