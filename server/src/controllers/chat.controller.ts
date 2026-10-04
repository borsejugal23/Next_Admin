import { Request, Response } from "express";
import {
  generateProductAnswer,
  isAIEnabled,
  parseQueryWithAI,
} from "../services/ai.service";
import {
  formatProductAnswer,
  parseProductQuery,
} from "../services/product-query-parser.service";
import { searchProducts } from "../services/product-query.service";
import { ProductQuery } from "../types/product-query.types";

const USE_AI_ANSWER = process.env.CHAT_USE_AI_ANSWER === "true";

async function resolveProductQuery(message: string): Promise<ProductQuery> {
  const ruleBasedQuery = parseProductQuery(message);

  if (!isAIEnabled()) {
    return ruleBasedQuery;
  }

  try {
    const aiQuery = await parseQueryWithAI(message);
    return {
      ...aiQuery,
      ...ruleBasedQuery,
      filters: {
        ...aiQuery.filters,
        ...ruleBasedQuery.filters,
      },
      sort: ruleBasedQuery.sort ?? aiQuery.sort,
    };
  } catch (error) {
    console.warn("AI query parsing failed, using rule-based parser:", error);
    return ruleBasedQuery;
  }
}

export const chatController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const trimmedMessage = message.trim();
    const query = await resolveProductQuery(trimmedMessage);
    const result = await searchProducts(query);

    let answer = formatProductAnswer(trimmedMessage, result);

    if (USE_AI_ANSWER && isAIEnabled()) {
      try {
        answer = await generateProductAnswer(trimmedMessage, result);
      } catch (error) {
        console.warn("AI answer generation failed, using template answer:", error);
      }
    }

    const response: {
      answer: string;
      products?: unknown[];
      total?: number;
      count?: number;
    } = { answer };

    if (typeof result.count === "number") {
      response.count = result.count;
    }

    if (query.includeProducts && "products" in result) {
      response.products = result.products;
      response.total = result.total;
    }

    return res.status(200).json(response);
  } catch (error: unknown) {
    console.error("CHAT ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Failed to process chat message";

    return res.status(500).json({ message });
  }
};
