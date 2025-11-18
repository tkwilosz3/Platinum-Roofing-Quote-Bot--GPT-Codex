import config from '../../../config/platinum_config.json';
import { PricingConfig } from '@/types';

export const pricingConfig = config as PricingConfig;

export const getMaterialLabel = (key: string) => pricingConfig.materials[key]?.label ?? key;
export const getStoryLabel = (key: string) => pricingConfig.stories[key]?.label ?? key;
export const getComplexityLabel = (key: string) => pricingConfig.complexity[key]?.label ?? key;
