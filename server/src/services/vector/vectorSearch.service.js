import mongoose from "mongoose";

import knowledgeChunkModel from "../../models/knowledgeChunk.model.js";

import { generateEmbedding } from "../embeddings/embedding.service.js";

const SIMILARITY_THRESHOLD = 0.45;

export const searchKnowledge = async ({
    query,
    organizationId,
    limit = 5,
}) => {
    try {
        if (!query || !query.trim()) {
            throw new Error("Search Query is required.");
        }

        if (!organizationId) {
            throw new Error("OrganizationId is required.");
        }

        const queryEmbedding = await generateEmbedding(query);

        const organizationObjectId =
            new mongoose.Types.ObjectId(organizationId);

        const results = await knowledgeChunkModel.aggregate([
            {
                $vectorSearch: {
                    index: "knowledge_vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit,
                    filter: {
                        organizationId: organizationObjectId,
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    sourceId: 1,
                    chunkIndex: 1,
                    organizationId: 1,
                    score: {
                        $meta: "vectorSearchScore",
                    },
                },
            },
        ]);

        // Debug logs - temporary for retrieval testing
        console.log("\n[Vector Search]");
        console.log("Query:", query);
        console.log("Candidates:", results.length);

        results.forEach((result, index) => {
            console.log(`\nCandidate ${index + 1}`);
            console.log("Score:", result.score);
            console.log("Chunk Index:", result.chunkIndex);
            console.log("Content:", result.content);
        });

        const filteredResults = results.filter(
            (result) => result.score >= SIMILARITY_THRESHOLD
        );

        console.log("\n[Similarity Filtering]");
        console.log("Threshold:", SIMILARITY_THRESHOLD);
        console.log("Chunks after filtering:", filteredResults.length);

        filteredResults.forEach((result, index) => {
            console.log(`\nSelected Chunk ${index + 1}`);
            console.log("Score:", result.score);
            console.log("Chunk Index:", result.chunkIndex);
            console.log("Content:", result.content);
        });

        return filteredResults;
    } catch (err) {
        console.error("Vector Search error:", err);
        throw new Error("Vector Search error");
    }
};