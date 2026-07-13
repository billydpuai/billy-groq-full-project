import requests
from bs4 import BeautifulSoup
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import re

urls = [
    "https://www.depaul.edu/tuition-and-aid/financial-aid-overview",
    "https://www.depaul.edu/tuition-and-aid/apply-for-aid",
    "https://www.depaul.edu/tuition-and-aid/scholarships",
    "https://www.depaul.edu/tuition-and-aid/types-of-aid",
    "https://www.depaul.edu/tuition-and-aid/financial-aid-and-eligibility/sap",
    "https://www.depaul.edu/tuition-and-aid/financial-aid-forms-and-resources/contact-us",
]

def scrape_page(url):
    try:
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, "html.parser")
        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r'\s+', ' ', text)
        return text[:1200]
    except Exception as e:
        return None

print("Scraping " + str(len(urls)) + " DePaul Financial Aid pages...")
all_context = ""
success_count = 0
for url in urls:
    page_text = scrape_page(url)
    if page_text:
        print("  OK   - " + url)
        all_context += "\n\n[Source: " + url + "]\n" + page_text
        success_count += 1
    else:
        print("  FAIL - " + url)

print(str(success_count) + " of " + str(len(urls)) + " pages scraped successfully.")
print("Total context length: " + str(len(all_context)) + " characters")

print("Loading Billy (Llama 3.1 8B)...")
model_path = "models/Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16, device_map="auto")

print("Billy is ready! Ask anything about DePaul Financial Aid, or type quit to exit.")

messages = [
    {"role": "system", "content": "You are Billy, DePaul University's financial aid assistant. Only answer using the information provided below. Mention which source URL the information came from when relevant. If the answer is not in the information given, say you are not confident and recommend contacting the Office of Financial Aid instead of guessing.\n\nDePaul Financial Aid Information:\n" + all_context}
]

while True:
    user_input = input("You: ")
    if user_input.lower() == "quit":
        break

    messages.append({"role": "user", "content": user_input})

    inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=200)
    answer = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)

    print("Billy: " + answer)
    messages = messages[:1]
