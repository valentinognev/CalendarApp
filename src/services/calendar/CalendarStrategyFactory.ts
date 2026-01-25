import type { CalendarStrategy } from './CalendarStrategy';
import { GregorianStrategy } from './GregorianStrategy';
import { JewishStrategy } from './JewishStrategy';

export class CalendarStrategyFactory {
    static getStrategy(id: string): CalendarStrategy {
        switch (id) {
            case 'jewish':
                return new JewishStrategy();
            case 'gregorian':
            default:
                return new GregorianStrategy();
        }
    }
}
