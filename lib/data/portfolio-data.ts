import type { PortfolioData } from './types';
import data from './portfolio-data.json';

const portfolioData = data as PortfolioData;

export const { personal, experience, education, certifications, projects, skillCategories, socialLinks, heroTitles } = portfolioData;
export default portfolioData;
