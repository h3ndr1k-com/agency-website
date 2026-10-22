export const STACKS = [
    { value: 'grok-bot', label: 'Grok Bot' },
    { value: 'n8n', label: 'n8n' },
    { value: 'voice', label: 'Voice' },
    { value: 'other', label: 'Other' },
];

const STACK_VALUES = new Set(STACKS.map((stack) => stack.value));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function stackLabel(value) {
    return STACKS.find((stack) => stack.value === value)?.label || value;
}

export function oneLine(value, max) {
    return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export function validateIntake(body) {
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const company = String(body?.company || '').trim();
    const stack = String(body?.stack || '').trim();
    const timeSink = String(body?.timeSink || '').trim();

    if (name.length < 2 || name.length > 120) return { error: 'Name is required' };
    if (!EMAIL.test(email) || email.length > 200) return { error: 'A valid email is required' };
    if (company.length < 1 || company.length > 160) return { error: 'Company is required' };
    if (!STACK_VALUES.has(stack)) return { error: 'Pick a stack' };
    if (timeSink.length < 2 || timeSink.length > 2000) return { error: 'Top time sink is required' };

    return { intake: { name, email, company, stack, timeSink } };
}
