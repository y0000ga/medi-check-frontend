import {
  CreatePatientRequest,
  EditPatientRequest,
  GetPatientsDto,
  IPatientDetailDto,
  TGetPatientsRequest,
} from "./types";

export const mapCreatePatientDto = (dto: CreatePatientRequest) => {
  return {
    name: dto.name,
    avatar_url: "_",
    birth_date: dto.birthDate,
    note: dto.note,
  };
};

export const mapGetPatientsRequestDto = (dto: TGetPatientsRequest) => {
  return {
    page: dto.page,
    page_size: dto.pageSize,
    sort_by: dto.sortBy,
    sort_order: dto.sortOrder,
    ...(dto.search ? { search: dto.search } : {}),
  };
};

export const mapGetPatientsResponseDto = (response: GetPatientsDto) => {
  return {
    page: response.page,
    totalSize: response.total_size,
    list: response.list.map((item) => ({
      id: item.id,
      permissionLevel: item.permission_level,
      name: item.name,
      linkedUserName: item.linked_user_name,
    })),
  };
};

export const mapGetPatientDetailssResponseDto = (
  response: IPatientDetailDto,
) => {
  return {
    note: response.note,
    name: response.name,
    id: response.id,
    permissionLevel: response.permission_level,
    linkedUserName: response.linked_user_name,
    birthDate: response.birth_date,
    avatarUrl: response.avatar_url,
  };
};

export const mapEditPatientDto = (dto: EditPatientRequest) => {
  return {
    ...(dto.name !== undefined ? { name: dto.name } : {}),
    ...(dto.birthDate !== undefined ? { birth_date: dto.birthDate } : {}),
    ...(dto.note !== undefined ? { note: dto.note } : {}),
  };
};
