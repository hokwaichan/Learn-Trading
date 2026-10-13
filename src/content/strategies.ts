import type { LegSpec } from '@/lib/pricing/templates';

export type Outlook = 'bullish' | 'bearish' | 'neutral' | 'volatile';

export interface StrategyTemplate {
  id: string;
  name: string;
  outlook: Outlook;
  /** One line: what the strategy is. */
  summary: string;
  /** When it fits. */
  when: string;
  maxProfit: string;
  maxLoss: string;
  breakEven: string;
  legs: LegSpec[];
  /** False for strategies whose payoff cannot be drawn at a single expiry (calendars). */
  singleExpiry: boolean;
  /** Lesson that teaches it, as 'module/lesson'. */
  lesson: string;
}

const call = (direction: 1 | -1, strikeOffset: number, quantity = 1, expiry?: 'near' | 'far'): LegSpec => ({ kind: 'option', type: 'call', direction, quantity, strikeOffset, expiry });
const put = (direction: 1 | -1, strikeOffset: number, quantity = 1, expiry?: 'near' | 'far'): LegSpec => ({ kind: 'option', type: 'put', direction, quantity, strikeOffset, expiry });
const stock = (direction: 1 | -1): LegSpec => ({ kind: 'stock', direction, quantity: 1 });

/**
 * Option strategy templates. Strikes are fractions away from the current
 * price, so a template works on any symbol. Used by the Options lessons, the
 * trainer's payoff drills and the strategy builder.
 *
 * To add one, append an entry: it appears in the builder's template list and
 * in the trainer automatically.
 */
export const OPTION_STRATEGIES: StrategyTemplate[] = [
  {
    id: 'long-call',
    name: 'Long call',
    outlook: 'bullish',
    summary: 'Buy a call.',
    when: 'You expect a clear rise, soon.',
    maxProfit: 'Unlimited',
    maxLoss: 'The premium paid',
    breakEven: 'Strike + premium',
    legs: [call(1, 0)],
    singleExpiry: true,
    lesson: 'options/basic-strategies',
  },
  {
    id: 'long-put',
    name: 'Long put',
    outlook: 'bearish',
    summary: 'Buy a put.',
    when: 'You expect a clear fall, soon.',
    maxProfit: 'Strike - premium',
    maxLoss: 'The premium paid',
    breakEven: 'Strike - premium',
    legs: [put(1, 0)],
    singleExpiry: true,
    lesson: 'options/basic-strategies',
  },
  {
    id: 'short-call',
    name: 'Short (uncovered) call',
    outlook: 'bearish',
    summary: 'Sell a call without owning the underlying.',
    when: 'Rarely appropriate: the loss is unlimited if the price rises.',
    maxProfit: 'The premium received',
    maxLoss: 'Unlimited',
    breakEven: 'Strike + premium',
    legs: [call(-1, 0.05)],
    singleExpiry: true,
    lesson: 'options/buying-vs-selling',
  },
  {
    id: 'covered-call',
    name: 'Covered call',
    outlook: 'neutral',
    summary: 'Own the stock and sell a call above the price.',
    when: 'You own the stock and expect it to go sideways or rise a little.',
    maxProfit: '(Strike - stock cost) + premium',
    maxLoss: 'Stock cost - premium',
    breakEven: 'Stock cost - premium',
    legs: [stock(1), call(-1, 0.05)],
    singleExpiry: true,
    lesson: 'options/basic-strategies',
  },
  {
    id: 'cash-secured-put',
    name: 'Cash-secured put',
    outlook: 'bullish',
    summary: 'Sell a put below the price, holding cash to buy the stock if assigned.',
    when: 'You would be happy to own the stock at a lower price.',
    maxProfit: 'The premium received',
    maxLoss: 'Strike - premium',
    breakEven: 'Strike - premium',
    legs: [put(-1, -0.05)],
    singleExpiry: true,
    lesson: 'options/basic-strategies',
  },
  {
    id: 'protective-put',
    name: 'Protective put',
    outlook: 'bullish',
    summary: 'Own the stock and buy a put below the price as insurance.',
    when: 'You own the stock, want to keep it, and fear a drop.',
    maxProfit: 'Unlimited',
    maxLoss: '(Stock cost - strike) + premium',
    breakEven: 'Stock cost + premium',
    legs: [stock(1), put(1, -0.05)],
    singleExpiry: true,
    lesson: 'options/basic-strategies',
  },
  {
    id: 'bull-call-spread',
    name: 'Bull call spread',
    outlook: 'bullish',
    summary: 'Buy a call and sell a higher-strike call.',
    when: 'You expect a moderate rise.',
    maxProfit: 'Strike difference - net debit',
    maxLoss: 'The net debit',
    breakEven: 'Lower strike + net debit',
    legs: [call(1, 0), call(-1, 0.1)],
    singleExpiry: true,
    lesson: 'options/spreads-and-volatility',
  },
  {
    id: 'bear-put-spread',
    name: 'Bear put spread',
    outlook: 'bearish',
    summary: 'Buy a put and sell a lower-strike put.',
    when: 'You expect a moderate fall.',
    maxProfit: 'Strike difference - net debit',
    maxLoss: 'The net debit',
    breakEven: 'Higher strike - net debit',
    legs: [put(1, 0), put(-1, -0.1)],
    singleExpiry: true,
    lesson: 'options/spreads-and-volatility',
  },
  {
    id: 'bull-put-spread',
    name: 'Bull put spread (credit)',
    outlook: 'bullish',
    summary: 'Sell a put and buy a lower-strike put.',
    when: 'You expect the price to stay above the sold strike.',
    maxProfit: 'The net credit',
    maxLoss: 'Strike difference - net credit',
    breakEven: 'Sold strike - net credit',
    legs: [put(-1, -0.05), put(1, -0.1)],
    singleExpiry: true,
    lesson: 'options/spreads-and-volatility',
  },
  {
    id: 'long-straddle',
    name: 'Long straddle',
    outlook: 'volatile',
    summary: 'Buy a call and a put at the same strike.',
    when: 'You expect a big move but do not know the direction, and implied volatility is not already high.',
    maxProfit: 'Unlimited',
    maxLoss: 'Both premiums',
    breakEven: 'Strike plus and minus the total premium',
    legs: [call(1, 0), put(1, 0)],
    singleExpiry: true,
    lesson: 'options/spreads-and-volatility',
  },
  {
    id: 'long-strangle',
    name: 'Long strangle',
    outlook: 'volatile',
    summary: 'Buy an out-of-the-money call and an out-of-the-money put.',
    when: 'You expect a very large move in either direction.',
    maxProfit: 'Unlimited',
    maxLoss: 'Both premiums',
    breakEven: 'Call strike + total premium, and put strike - total premium',
    legs: [call(1, 0.05), put(1, -0.05)],
    singleExpiry: true,
    lesson: 'options/spreads-and-volatility',
  },
  {
    id: 'iron-condor',
    name: 'Iron condor',
    outlook: 'neutral',
    summary: 'Sell an out-of-the-money put spread and call spread together.',
    when: 'You expect the price to stay inside a range, and implied volatility is fairly high.',
    maxProfit: 'The net credit',
    maxLoss: 'Spread width - net credit',
    breakEven: 'Sold put strike - credit, and sold call strike + credit',
    legs: [put(1, -0.1), put(-1, -0.05), call(-1, 0.05), call(1, 0.1)],
    singleExpiry: true,
    lesson: 'options/advanced-strategies',
  },
  {
    id: 'long-butterfly',
    name: 'Long call butterfly',
    outlook: 'neutral',
    summary: 'Buy one lower call, sell two middle calls, buy one higher call.',
    when: 'You expect the price to finish very close to a particular level.',
    maxProfit: 'Strike spacing - net debit',
    maxLoss: 'The net debit',
    breakEven: 'Lower strike + debit, and upper strike - debit',
    legs: [call(1, -0.05), call(-1, 0, 2), call(1, 0.05)],
    singleExpiry: true,
    lesson: 'options/advanced-strategies',
  },
  {
    id: 'calendar-spread',
    name: 'Calendar spread',
    outlook: 'neutral',
    summary: 'Sell a near-term option and buy a longer-term one at the same strike.',
    when: 'You expect the price to stay near the strike for now, and perhaps move later.',
    maxProfit: 'Depends on the value of the longer option when the near one expires',
    maxLoss: 'The net debit',
    breakEven: 'Depends on implied volatility',
    legs: [call(-1, 0, 1, 'near'), call(1, 0, 1, 'far')],
    singleExpiry: false,
    lesson: 'options/advanced-strategies',
  },
];

export function getStrategyTemplate(id: string): StrategyTemplate | undefined {
  return OPTION_STRATEGIES.find((s) => s.id === id);
}

export interface OutlookScenario {
  id: string;
  /** The situation described to the learner. */
  prompt: string;
  /** Id of the best-fitting strategy. */
  answer: string;
  /** Ids of plausible but worse choices, used as wrong answers. */
  distractors: string[];
  why: string;
}

/** "Pick a strategy for this outlook" drills. */
export const OUTLOOK_SCENARIOS: OutlookScenario[] = [
  {
    id: 'strong-rise-soon',
    prompt: 'You expect a stock to rise sharply within the next month and want your loss limited to a small, fixed amount.',
    answer: 'long-call',
    distractors: ['covered-call', 'long-put', 'iron-condor'],
    why: 'A bought call has unlimited upside and can lose only its premium. A covered call would cap the very rise you expect.',
  },
  {
    id: 'sharp-fall-soon',
    prompt: 'You expect a stock to fall sharply over the next few weeks and want a defined, limited risk.',
    answer: 'long-put',
    distractors: ['short-call', 'cash-secured-put', 'long-call'],
    why: 'A bought put profits from a fall and can lose only its premium. An uncovered short call also profits from a fall but has unlimited risk.',
  },
  {
    id: 'own-stock-sideways',
    prompt: 'You own 100 shares and expect the price to drift sideways for a month. You would like some income from them.',
    answer: 'covered-call',
    distractors: ['protective-put', 'long-straddle', 'long-call'],
    why: 'Selling a call against shares you own collects premium. You give up gains above the strike, which you do not expect anyway.',
  },
  {
    id: 'own-stock-fear-drop',
    prompt: 'You own shares you want to keep for years, but you are worried about a sharp drop over the next two months.',
    answer: 'protective-put',
    distractors: ['covered-call', 'cash-secured-put', 'bull-call-spread'],
    why: 'A bought put is insurance: whatever happens you can sell at the strike. A covered call would add income but gives no protection against a large fall.',
  },
  {
    id: 'buy-lower',
    prompt: 'You like a stock at $100 but think it is a little expensive. You would happily buy it at $95, and have the cash ready.',
    answer: 'cash-secured-put',
    distractors: ['long-call', 'long-straddle', 'bear-put-spread'],
    why: 'Selling the 95 put pays you a premium to wait. Either it expires and you keep the premium, or you buy the stock at 95, below today\'s price.',
  },
  {
    id: 'moderate-rise-cheap',
    prompt: 'You expect a modest rise of about 5% to 10% and want to pay less than a plain call would cost.',
    answer: 'bull-call-spread',
    distractors: ['long-straddle', 'long-call', 'iron-condor'],
    why: 'Selling a higher-strike call pays for part of the call you buy. The gain is capped at the higher strike, which fits a modest target.',
  },
  {
    id: 'moderate-fall-cheap',
    prompt: 'You expect a modest decline of about 5% to 10% and want a cheaper bet than buying a put outright.',
    answer: 'bear-put-spread',
    distractors: ['long-put', 'short-call', 'long-strangle'],
    why: 'Selling a lower-strike put pays for part of the put you buy. Profit is capped at the lower strike, which fits a modest decline.',
  },
  {
    id: 'big-move-unknown',
    prompt: 'A court ruling next week will send a stock sharply up or sharply down. You have no idea which. Implied volatility is still low.',
    answer: 'long-straddle',
    distractors: ['iron-condor', 'covered-call', 'long-butterfly'],
    why: 'A straddle holds a call and a put, so it profits from a large move either way. Low implied volatility means the options are not yet expensive.',
  },
  {
    id: 'huge-move-cheap',
    prompt: 'You expect an enormous move in either direction and want to pay as little as possible for the bet.',
    answer: 'long-strangle',
    distractors: ['long-straddle', 'iron-condor', 'bull-call-spread'],
    why: 'A strangle uses out-of-the-money options, so it costs less than a straddle. It needs a bigger move to pay, which is what you expect.',
  },
  {
    id: 'range-high-iv',
    prompt: 'A stock has been stuck between 90 and 110 for months and you expect that to continue. Implied volatility is high. You want your maximum loss capped.',
    answer: 'iron-condor',
    distractors: ['long-straddle', 'short-call', 'long-call'],
    why: 'An iron condor collects premium if the price stays in a range, and the bought outer options cap the loss. High implied volatility means a larger credit.',
  },
  {
    id: 'pin-a-price',
    prompt: 'You expect a stock to finish the month almost exactly at 100 and want a small, cheap bet with a large payoff if you are right.',
    answer: 'long-butterfly',
    distractors: ['long-strangle', 'long-call', 'protective-put'],
    why: 'A butterfly costs a small debit and pays most when the price ends at the middle strike. It loses only that debit if the price ends far away.',
  },
  {
    id: 'quiet-now-move-later',
    prompt: 'You expect a stock to sit still for the next few weeks, then possibly move later in the year. You expect implied volatility to rise.',
    answer: 'calendar-spread',
    distractors: ['iron-condor', 'long-straddle', 'covered-call'],
    why: 'A calendar sells fast-decaying near-term premium and keeps a longer-dated option that gains if volatility rises. An iron condor loses when volatility rises.',
  },
  {
    id: 'stay-above-level',
    prompt: 'You think a stock will stay above 95 for the next month. You want to be paid for that view with a capped loss if you are wrong.',
    answer: 'bull-put-spread',
    distractors: ['long-put', 'long-straddle', 'short-call'],
    why: 'Selling the 95 put and buying a lower put collects a credit that you keep if the price stays above 95. The bought put caps the loss.',
  },
  {
    id: 'never-do-this',
    prompt: 'Which of these has a loss that can grow without limit if you are wrong?',
    answer: 'short-call',
    distractors: ['long-call', 'iron-condor', 'bear-put-spread'],
    why: 'An uncovered short call must deliver at the strike something that could cost any amount to buy. The other three all have a fixed maximum loss.',
  },
];
