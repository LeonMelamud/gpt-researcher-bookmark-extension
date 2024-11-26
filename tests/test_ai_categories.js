import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { classifyBookmarkWithGPT } from '../classifier.js';

describe('AI Category Detection Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    // Helper function to mock GPT response
    const mockGPTResponse = (report) => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    report,
                    sources: ['https://example.com']
                })
            })
        );
    };

    // Core AI & ML Categories
    describe('Core AI & ML Categories', () => {
        test('should detect deep learning frameworks', async () => {
            const reports = [
                'PyTorch is a deep learning framework with dynamic computational graphs.',
                'TensorFlow provides comprehensive tools for neural network development.',
                'JAX enables automatic differentiation and accelerated ML research.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['Deep Learning', 'Neural Networks', 'AI Development']).toContain(category);
            }
        });

        test('should identify NLP resources', async () => {
            const reports = [
                'BERT is a transformer-based language model for NLP tasks.',
                'Hugging Face provides state-of-the-art NLP models and tools.',
                'SpaCy offers industrial-strength natural language processing.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['Natural Language Processing', 'AI/Machine Learning']).toContain(category);
            }
        });
    });

    // AI Applications
    describe('AI Applications', () => {
        test('should categorize AI art tools', async () => {
            const reports = [
                'DALL-E 2 generates artistic images from textual descriptions.',
                'Midjourney is an AI-powered creative tool for digital art.',
                'Stable Diffusion enables high-quality image generation.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['AI Art & Creation', 'AI Tools']).toContain(category);
            }
        });

        test('should identify AI coding assistants', async () => {
            const reports = [
                'GitHub Copilot helps developers write better code using AI.',
                'Amazon CodeWhisperer provides AI-powered code suggestions.',
                'Codeium offers intelligent code completion and generation.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['AI Code Generation', 'AI Tools']).toContain(category);
            }
        });
    });

    // AI Infrastructure
    describe('AI Infrastructure', () => {
        test('should detect MLOps tools', async () => {
            const reports = [
                'Kubeflow streamlines machine learning workflows on Kubernetes.',
                'MLflow provides an end-to-end MLOps platform.',
                'Weights & Biases enables experiment tracking and model management.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['MLOps', 'AI Infrastructure']).toContain(category);
            }
        });

        test('should identify cloud AI services', async () => {
            const reports = [
                'AWS SageMaker provides managed machine learning services.',
                'Google Vertex AI offers end-to-end ML platform capabilities.',
                'Azure Machine Learning supports the complete ML lifecycle.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(['AI Cloud Services', 'AI Infrastructure']).toContain(category);
            }
        });
    });

    // Edge Cases and Special Scenarios
    describe('Edge Cases and Special Scenarios', () => {
        test('should handle multi-topic content', async () => {
            const reports = [
                'AI in healthcare using NLP and MLOps practices.',
                'Ethical considerations in healthcare AI deployment.',
                'Machine learning operations in medical research.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect([
                    'AI Healthcare',
                    'AI Ethics',
                    'MLOps',
                    'Natural Language Processing'
                ]).toContain(category);
            }
        });

        test('should handle emerging AI fields', async () => {
            const reports = [
                'AI-powered manufacturing optimization and robotics.',
                'Autonomous systems in industrial applications.',
                'Latest research in AI-driven manufacturing.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect([
                    'AI Manufacturing',
                    'Autonomous Systems',
                    'AI Research'
                ]).toContain(category);
            }
        });

        test('should handle AI news and updates', async () => {
            const reports = [
                'Latest developments in artificial intelligence research.',
                'AI market trends and industry analysis.',
                'Breaking news in AI technology and applications.'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                expect([
                    'AI News',
                    'AI Research',
                    'AI Market Analysis'
                ]).toContain(category);
            }
        });

        test('should handle malformed or ambiguous content', async () => {
            const reports = [
                'Brief mention of AI in unrelated context',
                'Technical article with minimal AI reference',
                'Mixed content about technology and automation'
            ];

            for (const report of reports) {
                mockGPTResponse(report);
                const category = await classifyBookmarkWithGPT('https://example.com');
                // Should fall back to more general categories or uncategorized
                expect([
                    'Technology',
                    'AI/Machine Learning',
                    'Uncategorized'
                ]).toContain(category);
            }
        });
    });
});
