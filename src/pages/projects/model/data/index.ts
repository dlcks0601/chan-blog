import type { ProjectDetail } from '../types';
import { whip } from './whip';
import { krwin } from './krwin';

/** Source of truth for all project detail content. */
export const projects: ProjectDetail[] = [whip, krwin];
