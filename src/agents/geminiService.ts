import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

// Initialize the Google Generative AI model
export const initializeGoogleModel = () => {
  return new ChatGoogleGenerativeAI({
    model: "gemini-pro", // or "gemini-1.5-pro", "gemini-1.5-flash", etc.
    temperature: 0,
    // You can also add other options like:
    // apiKey: process.env.GOOGLE_API_KEY, // if not set via environment variables
    // maxOutputTokens: 1024,
  });
};

// Helper function to add a system message to the chat history
export const initializeGoogleChatHistory = () => {
  return [
    new SystemMessage("You are a helpful, friendly AI assistant. Be elaborative and engaging in your responses.")
  ];
};

// Helper function to get AI response
export const getGoogleResponse = async (model: ChatGoogleGenerativeAI, chatHistory: (SystemMessage | HumanMessage | AIMessage)[]) => {
  return await model.invoke(chatHistory);
};