from typing import Dict

# OpenAI GPT-3.5 Turbo pricing per 1K tokens (as of 2024)
PRICING = {
    'input': 0.0010,   # $0.0010 per 1K input tokens
    'output': 0.0020   # $0.0020 per 1K output tokens
}

def calculate_cost(prompt_tokens: int, completion_tokens: int) -> float:
    """
    Calculate the cost of an OpenAI API call in USD.
    
    Args:
        prompt_tokens: Number of tokens in the prompt (input)
        completion_tokens: Number of tokens in the completion (output)
    
    Returns:
        float: Cost in USD
    """
    input_cost = (prompt_tokens / 1000) * PRICING['input']
    output_cost = (completion_tokens / 1000) * PRICING['output']
    return round(input_cost + output_cost, 6)  # Round to 6 decimal places
