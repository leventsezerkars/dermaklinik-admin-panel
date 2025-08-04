export interface SelectListItem {
  text: string;
  value: string;
  disabled: string | null;
  selected: string | null;
  group: string | null;
}

export interface Constants {
  name: string;
  items: Array<SelectListItem>;
}
