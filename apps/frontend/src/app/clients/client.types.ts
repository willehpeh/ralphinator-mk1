/**
 * Client status type representing all possible client states.
 * This is duplicated from the domain layer to respect module boundaries.
 * Frontend can only depend on scope:frontend tagged packages.
 */
export type ClientStatus = 'Active' | 'Inactive' | 'Prospect' | 'Past Client';
