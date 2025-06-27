import { classifyText } from "@/server/huggingface/distillbert"

export const classify = async (text: string, labels: string[]) => {
    const result = await classifyText(text, labels);
    return result;
}