from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_path = "models/Llama-3.1-8B-Instruct"

print("Loading model... this may take a minute")

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.bfloat16, device_map="auto")

messages = [
    {"role": "system", "content": "You are Billy, DePaul University's helpful assistant. Only answer using information you are given. If you don't know, say so honestly."},
    {"role": "user", "content": "Where is the financial aid office located?"}
]

inputs = tokenizer.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt", return_dict=True).to(model.device)

outputs = model.generate(**inputs, max_new_tokens=200)

response = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:], skip_special_tokens=True)

print("\nBilly says:")
print(response)
