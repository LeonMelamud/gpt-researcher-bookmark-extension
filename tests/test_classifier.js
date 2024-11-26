import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { classifyBookmark, classifyBookmarkWithGPT } from '../classifier.js';

describe('Bookmark Classifier Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    // Helper function to mock fetch for basic classification
    const mockFetchForBasicClassification = (content) => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                text: () => Promise.resolve(content)
            })
        );
    };

    // Helper function to mock fetch for GPT classification
    const mockFetchForGPT = (response) => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(response)
            })
        );
    };

    // Basic classifier tests
    describe('classifyBookmark', () => {
        test('should classify AI-related content', async () => {
            mockFetchForBasicClassification(`
                <html>
                    <head>
                        <title>Machine Learning Tutorial</title>
                        <meta name="description" content="Learn about artificial intelligence and neural networks" />
                    </head>
                    <body>AI content</body>
                </html>
            `);

            const category = await classifyBookmark('https://example.com');
            expect(category).toBe('AI/Machine Learning');
        });

        test('should classify technology content', async () => {
            mockFetchForBasicClassification(`
                <html>
                    <head>
                        <title>Programming Guide</title>
                        <meta name="description" content="Learn software development" />
                    </head>
                    <body>Tech content</body>
                </html>
            `);

            const category = await classifyBookmark('https://example.com');
            expect(category).toBe('Technology');
        });

        test('should return Uncategorized for failed requests', async () => {
            global.fetch.mockImplementationOnce(() => Promise.reject('Network error'));
            const category = await classifyBookmark('https://example.com');
            expect(category).toBe('Uncategorized');
        });
    });

    // GPT-enhanced classifier tests
    describe('classifyBookmarkWithGPT', () => {
        test('should classify using GPT Researcher', async () => {
            mockFetchForGPT({
                report: 'This is an AI research paper discussing neural networks and deep learning.',
                sources: ['https://example.com']
            });

            const category = await classifyBookmarkWithGPT('https://example.com');
            expect(['AI Research', 'Neural Networks', 'Deep Learning']).toContain(category);
        });

        test('should fallback to basic classification on API error', async () => {
            // First call fails (GPT API)
            global.fetch.mockImplementationOnce(() => Promise.reject('API Error'));
            
            // Second call succeeds (basic classification)
            mockFetchForBasicClassification(`
                <html>
                    <head>
                        <title>AI News</title>
                        <meta name="description" content="Latest in AI" />
                    </head>
                    <body>AI content</body>
                </html>
            `);

            const category = await classifyBookmarkWithGPT('https://example.com');
            expect(category).toBe('AI/Machine Learning');
        });

        test('should handle empty or invalid responses', async () => {
            mockFetchForGPT({
                error: 'Invalid URL'
            });

            const category = await classifyBookmarkWithGPT('invalid-url');
            expect(category).toBe('Uncategorized');
        });

        // Test specific AI categories
        test('should identify specific AI subcategories', async () => {
            const testCases = [
                {
                    report: 'This is a computer vision project using deep learning',
                    expectedCategory: 'Computer Vision'
                },
                {
                    report: 'An AI tool for generating art and images',
                    expectedCategory: 'AI Art & Creation'
                },
                {
                    report: 'MLOps platform for managing AI infrastructure',
                    expectedCategory: 'MLOps'
                },
                {
                    report: 'AI ethics guidelines and safety considerations',
                    expectedCategory: 'AI Ethics'
                }
            ];

            for (const testCase of testCases) {
                mockFetchForGPT({
                    report: testCase.report,
                    sources: ['https://example.com']
                });

                const category = await classifyBookmarkWithGPT('https://example.com');
                expect(category).toBe(testCase.expectedCategory);
            }
        });
    });
});
