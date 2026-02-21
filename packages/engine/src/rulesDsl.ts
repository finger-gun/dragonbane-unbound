import type {
  RuleReceipt,
  RulesEvaluationResult,
  RulesExpression,
  RulesRule,
  RulesValue,
  Ruleset,
  RuleStep,
} from '@dbu/types';

const asNumber = (value: RulesValue) => {
  if (typeof value === 'number') return value;
  if (value === null) return 0;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const evaluateExpression = (
  expression: RulesExpression,
  inputs: Record<string, RulesValue>,
  steps: RuleStep[],
  stepId: string
): RulesValue => {
  let value: RulesValue;

  switch (expression.type) {
    case 'const':
      value = expression.value;
      break;
    case 'attr':
      value = inputs[expression.key] ?? null;
      break;
    case 'add': {
      const total = expression.items.reduce((sum: number, item: RulesExpression, index: number) => {
        const next = evaluateExpression(item, inputs, steps, `${stepId}.add.${index}`);
        return sum + asNumber(next);
      }, 0);
      value = total;
      break;
    }
    case 'mul': {
      const total = expression.items.reduce(
        (product: number, item: RulesExpression, index: number) => {
        const next = evaluateExpression(item, inputs, steps, `${stepId}.mul.${index}`);
        return product * asNumber(next);
      },
        1
      );
      value = total;
      break;
    }
    case 'div': {
      const numerator = asNumber(evaluateExpression(expression.numerator, inputs, steps, `${stepId}.num`));
      const denominator = asNumber(
        evaluateExpression(expression.denominator, inputs, steps, `${stepId}.den`)
      );
      value = denominator === 0 ? 0 : numerator / denominator;
      break;
    }
    case 'ceil': {
      const next = asNumber(evaluateExpression(expression.value, inputs, steps, `${stepId}.ceil`));
      value = Math.ceil(next);
      break;
    }
    case 'floor': {
      const next = asNumber(evaluateExpression(expression.value, inputs, steps, `${stepId}.floor`));
      value = Math.floor(next);
      break;
    }
    case 'mapLookup': {
      const key = evaluateExpression(expression.key, inputs, steps, `${stepId}.map.key`);
      const lookupKey = key === null ? '' : String(key);
      value = Object.prototype.hasOwnProperty.call(expression.map, lookupKey)
        ? expression.map[lookupKey]
        : null;
      break;
    }
    case 'rangeLookup': {
      const numeric = asNumber(evaluateExpression(expression.value, inputs, steps, `${stepId}.range.value`));
      const match = expression.ranges.find(
        (range: { min: number; max: number; result: RulesValue }) =>
          numeric >= range.min && numeric <= range.max
      );
      value = match ? match.result : null;
      break;
    }
    default:
      value = null;
      break;
  }

  steps.push({ id: stepId, expression, value });
  return value;
};

export const evaluateRule = (rule: RulesRule, inputs: Record<string, RulesValue>): RuleReceipt => {
  const steps: RuleStep[] = [];
  const result = evaluateExpression(rule.expression, inputs, steps, rule.id);

  return {
    ruleId: rule.id,
    output: rule.output,
    inputs,
    steps,
    result,
  };
};

export const evaluateRuleset = (
  ruleset: Ruleset,
  inputs: Record<string, RulesValue>
): RulesEvaluationResult => {
  const outputs: Record<string, RulesValue> = {};
  const receipts: RuleReceipt[] = [];

  ruleset.rules.forEach((rule: RulesRule) => {
    const receipt = evaluateRule(rule, inputs);
    outputs[rule.output] = receipt.result;
    receipts.push(receipt);
  });

  return { outputs, receipts };
};
