import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import {
  CreateClassRequest,
  CreateParentRequest,
  CreateStudentRequest,
  CreateSubscriptionRequest,
  RegisterStudentToClassRequest,
  UpdateParentRequest,
  UpdateStudentRequest
} from '../types/api';

// Query Keys
export const queryKeys = {
  students: ['students'] as const,
  student: (id: number) => ['students', id] as const,
  parents: ['parents'] as const,
  parent: (id: number) => ['parents', id] as const,
  classes: ['classes'] as const,
  class: (id: number) => ['classes', id] as const,
  classesByDayNumber: (day: number) => ['classes', 'by-day-number', day] as const,
  subscription: (id: number) => ['subscriptions', id] as const,
};

// Student Hooks
export const useStudents = () => {
  return useQuery({
    queryKey: queryKeys.students,
    queryFn: () => apiClient.getAllStudents(),
  });
};

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: queryKeys.student(id),
    queryFn: () => apiClient.getStudentById(id),
    enabled: !!id,
  });
};

export const useStudentDetails = (id: number) => {
  return useQuery({
    queryKey: ['students', id, 'details'],
    queryFn: () => apiClient.getStudentDetails(id),
    enabled: !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentRequest) => apiClient.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentRequest }) =>
      apiClient.updateStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
      queryClient.invalidateQueries({ queryKey: queryKeys.student(variables.id) });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
    },
  });
};

// Parent Hooks
export const useParents = () => {
  return useQuery({
    queryKey: queryKeys.parents,
    queryFn: () => apiClient.getAllParents(),
  });
};

export const useParent = (id: number) => {
  return useQuery({
    queryKey: queryKeys.parent(id),
    queryFn: () => apiClient.getParentById(id),
    enabled: !!id,
  });
};

export const useCreateParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParentRequest) => apiClient.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
    },
  });
};

export const useUpdateParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateParentRequest }) =>
      apiClient.updateParent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
      queryClient.invalidateQueries({ queryKey: queryKeys.parent(variables.id) });
    },
  });
};

export const useDeleteParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parents });
    },
  });
};

// Class Hooks
export const useClasses = () => {
  return useQuery({
    queryKey: queryKeys.classes,
    queryFn: () => apiClient.getAllClasses(),
  });
};

export const useClass = (id: number) => {
  return useQuery({
    queryKey: queryKeys.class(id),
    queryFn: () => apiClient.getClassById(id),
    enabled: !!id,
  });
};

export const useClassesByDayNumber = (day: number) => {
  return useQuery({
    queryKey: queryKeys.classesByDayNumber(day),
    queryFn: () => apiClient.getClassesByDayNumber(day),
    enabled: day >= 0 && day <= 6,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassRequest) => apiClient.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
    },
  });
};

// Subscription Hooks
export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => apiClient.getAllSubscriptions(),
  });
};

export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: queryKeys.subscription(id),
    queryFn: () => apiClient.getSubscriptionById(id),
    enabled: !!id,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => apiClient.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
};


export const useUseSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.useSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription(id) });
    },
  });
};

export const useRegisterStudentToClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: number; data: RegisterStudentToClassRequest }) =>
      apiClient.registerStudentToClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
      queryClient.invalidateQueries({ queryKey: queryKeys.class(variables.classId) });
      queryClient.invalidateQueries({ queryKey: ['classes', variables.classId, 'details'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.students });
    },
  });
};


