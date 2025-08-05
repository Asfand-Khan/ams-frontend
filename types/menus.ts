export type menuChildsTypes = {
  id: number;
  name: string;
  url: string;
  icon: string | null;
  parent_id: number | null;
  sorting: number | null;
  description: string;
};

export type allMenusPayloadType = {
  menu_id: number;
  name: string;
  url: string;
  icon: string;
  parent_id: number | null;
  sorting: number;
  description: string;
  childs: menuChildsTypes[];
};

export type allMenusResponse = {
  status: 1 | 0;
  message: string;
  payload: allMenusPayloadType[];
};

export type RightsType = "can_view" | "can_create" | "can_edit" | "can_delete";

export type MenuRightsTypes = {
  menu_id: number;
} & Record<RightsType, boolean>;
