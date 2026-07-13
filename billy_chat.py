import requests
from bs4 import BeautifulSoup
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import re

print("Scraping DePaul financial aid page...")
url = "https://www.depaul.edu/tuition-and-aid/financial-aid-overview"
response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
soup = BeautifulSoup(response.content, "html.parser")
text = soup.get_text(separator=" ", strip=True)
text = re.sub(r'\s+', ' ', text)
context = text[:3000]
print("Scraped " + str(len(context)) + " characters.")

print("Loading Billy (Llama 3.1 8B)...")
model_path = "models/Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16, device_map="auto")

print("Billy is ready! Ask anything about DePaul financial aid, or type quit to exit.")

messages = [
    {"role": "system", "content": "You are Billy, DePaul University's assistant. Only answer using the information provided below. If the answer is not in the information given, say you are not confident and recommend contacting the right DePaul office instead of guessing.\n\nDePaul Website Information:\n" + context}
]

while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        break

    messages.append({"role": "user", "content": user_input})

    inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=250)
    answer = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)

    print("Billy: " + answer)
    messages.append({"role": "assistant", "content": answer})
