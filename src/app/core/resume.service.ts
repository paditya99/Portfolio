import { Injectable } from '@angular/core';
import {
  PROFILE, LINKS, SUMMARY, STATS, ROLES, PROJECTS, SKILLS,
  EDUCATION, ACHIEVEMENTS, ARCH_FLOWS, techLink,
} from '../data/resume';

/**
 * Injectable access point for resume content. Components depend on this
 * abstraction rather than importing the data module directly, which keeps
 * them decoupled from where the data lives and easy to test with a stub.
 */
@Injectable({ providedIn: 'root' })
export class ResumeService {
  readonly profile = PROFILE;
  readonly links = LINKS;
  readonly summary = SUMMARY;
  readonly stats = STATS;
  readonly roles = ROLES;
  readonly projects = PROJECTS;
  readonly skills = SKILLS;
  readonly education = EDUCATION;
  readonly achievements = ACHIEVEMENTS;
  readonly archFlows = ARCH_FLOWS;

  /** Official docs for a technology term, or `undefined` when it has none. */
  readonly techLink = techLink;
}
