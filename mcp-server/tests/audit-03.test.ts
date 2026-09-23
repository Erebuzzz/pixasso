import assert from 'node:assert';
import { handleDiscoverIntent } from '../src/tools/discoverIntent';

console.log('=== RUNNING AUDIT-03 ACCEPTANCE CHECKS ===\n');

// Test Case A: Discovery without referenceUrls (should include optional reference question)
console.log('--- Test Case A: Discover intent without referenceUrls ---');
const resWithout = handleDiscoverIntent({
  projectArchetype: 'editorial_landing_page',
  description: 'A literary magazine for speculative fiction'
});

const referenceQuestion = resWithout.compulsoryPopupQuestions.find((q) =>
  q.question.includes('reference sites or apps that capture the feel')
);

assert(referenceQuestion, 'Optional reference question MUST be present when referenceUrls is omitted');
assert.strictEqual(
  referenceQuestion.question,
  'Do you have any reference sites or apps that capture the feel you are going for? (Optional, skip if you want Pixasso to formulate the aesthetic from scratch)'
);
assert.strictEqual(referenceQuestion.is_multi_select, false);
assert(referenceQuestion.options[0].startsWith('(Recommended) Synthesize from scratch'));
console.log('-> Test Case A PASSED: Optional reference question presented when no referenceUrls provided.');

// Test Case B: Discovery with empty referenceUrls array (should include optional question)
console.log('\n--- Test Case B: Discover intent with empty referenceUrls array ---');
const resEmpty = handleDiscoverIntent({
  projectArchetype: 'full_web_app',
  description: 'A telemetry dashboard',
  referenceUrls: []
});

const referenceQuestionEmpty = resEmpty.compulsoryPopupQuestions.find((q) =>
  q.question.includes('reference sites or apps that capture the feel')
);
assert(referenceQuestionEmpty, 'Optional reference question MUST be present when referenceUrls is empty array');
console.log('-> Test Case B PASSED: Optional reference question presented when referenceUrls is empty.');

// Test Case C: Discovery with provided referenceUrls (should omit optional question)
console.log('\n--- Test Case C: Discover intent with provided referenceUrls ---');
const resWith = handleDiscoverIntent({
  projectArchetype: 'editorial_landing_page',
  description: 'A literary magazine for speculative fiction',
  referenceUrls: ['https://stripe.dev', 'https://noerd.com']
});

const referenceQuestionWith = resWith.compulsoryPopupQuestions.find((q) =>
  q.question.includes('reference sites or apps that capture the feel')
);
assert.strictEqual(referenceQuestionWith, undefined, 'Optional reference question MUST be omitted when referenceUrls are provided');
console.log('-> Test Case C PASSED: Optional reference question omitted when referenceUrls provided.');

console.log('\n=== ALL AUDIT-03 ACCEPTANCE CHECKS PASSED SUCCESSFULLY ===');
