import type { Quiz } from '@/types';
import { basicsQuizzes } from './01-basics';
import { candlesticksQuizzes } from './02-candlesticks';
import { marketStructureQuizzes } from './03-market-structure';
import { chartPatternsQuizzes } from './04-chart-patterns';
import { indicatorsQuizzes } from './05-indicators';
import { strategiesQuizzes } from './06-strategies';
import { riskManagementQuizzes } from './07-risk-management';
import { futuresQuizzes } from './08-futures';
import { optionsQuizzes } from './09-options';
import { psychologyQuizzes } from './10-psychology';
import { fundamentalsQuizzes } from './11-fundamentals';
import { biggerPictureQuizzes } from './12-bigger-picture';
import { smartMoneyQuizzes } from './13-smart-money';
import { ictQuizzes } from './14-ict';
import { dayTradingQuizzes } from './15-day-trading';
import { tradeManagementQuizzes } from './16-trade-management';
import { marketsInPracticeQuizzes } from './17-markets-in-practice';
import { stayingInTheGameQuizzes } from './18-staying-in-the-game';

/** Every quiz, one per lesson. A quiz id is `${moduleId}/${lessonId}`. */
export const QUIZZES: Quiz[] = [
  ...basicsQuizzes,
  ...candlesticksQuizzes,
  ...marketStructureQuizzes,
  ...chartPatternsQuizzes,
  ...indicatorsQuizzes,
  ...strategiesQuizzes,
  ...riskManagementQuizzes,
  ...futuresQuizzes,
  ...optionsQuizzes,
  ...psychologyQuizzes,
  ...fundamentalsQuizzes,
  ...biggerPictureQuizzes,
  ...smartMoneyQuizzes,
  ...ictQuizzes,
  ...dayTradingQuizzes,
  ...tradeManagementQuizzes,
  ...marketsInPracticeQuizzes,
  ...stayingInTheGameQuizzes,
];

const BY_ID = new Map(QUIZZES.map((quiz) => [quiz.id, quiz]));

export function getQuiz(id: string): Quiz | undefined {
  return BY_ID.get(id);
}
