export type Card = {
  token: string;
  last_four: string;
  memo: string;
  spend_limit: number;
  spend_limit_duration: string;
  exp_month: string;
  exp_year: string;
  state: string;
  created: string;
  funding: object;
  type: string;
  auth_rule_tokens: Array<string>;
}