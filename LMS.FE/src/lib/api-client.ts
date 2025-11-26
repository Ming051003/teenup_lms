import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ClassResponse,
  CreateClassRequest,
  CreateParentRequest,
  CreateStudentRequest,
  CreateSubscriptionRequest,
  ParentResponse,
  RegisterStudentToClassRequest,
  StudentDetailResponse,
  StudentResponse,
  SubscriptionResponse,
  UpdateParentRequest,
  UpdateStudentRequest
} from '../types/api';

class TeenUpApiClient {
  private api: AxiosInstance;

  constructor(baseURL: string ='https://lmsteenup.runasp.net/api') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for debugging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Student APIs
  async getAllStudents(): Promise<StudentResponse[]> {
    const response: AxiosResponse<StudentResponse[]> = await this.api.get('/students');
    return response.data;
  }

  async getStudentById(id: number): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await this.api.get(`/students/${id}`);
    return response.data;
  }

  async createStudent(data: CreateStudentRequest): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await this.api.post('/students', data);
    return response.data;
  }

  async updateStudent(id: number, data: UpdateStudentRequest): Promise<StudentResponse> {
    const response: AxiosResponse<StudentResponse> = await this.api.put(`/students/${id}`, data);
    return response.data;
  }

  async deleteStudent(id: number): Promise<string> {
    const response: AxiosResponse<string> = await this.api.delete(`/students/${id}`);
    return response.data;
  }

  async getStudentDetails(id: number): Promise<StudentDetailResponse> {
    const response: AxiosResponse<StudentDetailResponse> = await this.api.get(`/students/${id}`);
    return response.data;
  }

  // Parent APIs
  async getAllParents(): Promise<ParentResponse[]> {
    const response: AxiosResponse<ParentResponse[]> = await this.api.get('/parents');
    return response.data;
  }

  async getParentById(id: number): Promise<ParentResponse> {
    const response: AxiosResponse<ParentResponse> = await this.api.get(`/parents/${id}`);
    return response.data;
  }

  async createParent(data: CreateParentRequest): Promise<ParentResponse> {
    const response: AxiosResponse<ParentResponse> = await this.api.post('/parents', data);
    return response.data;
  }

  async updateParent(id: number, data: UpdateParentRequest): Promise<ParentResponse> {
    const response: AxiosResponse<ParentResponse> = await this.api.put(`/parents/${id}`, data);
    return response.data;
  }

  async deleteParent(id: number): Promise<string> {
    const response: AxiosResponse<string> = await this.api.delete(`/parents/${id}`);
    return response.data;
  }

  // Class APIs
  async getAllClasses(): Promise<ClassResponse[]> {
    const response: AxiosResponse<ClassResponse[]> = await this.api.get('/classes');
    return response.data;
  }

  async getClassById(id: number): Promise<ClassResponse> {
    const response: AxiosResponse<ClassResponse> = await this.api.get(`/classes/${id}`);
    return response.data;
  }

  async getClassesByDayNumber(day: number): Promise<ClassResponse[]> {
    const response: AxiosResponse<ClassResponse[]> = await this.api.get('/classes/by-day', {
      params: { day }
    });
    return response.data;
  }

  async createClass(data: CreateClassRequest): Promise<ClassResponse> {
    const response: AxiosResponse<ClassResponse> = await this.api.post('/classes', data);
    return response.data;
  }

  async registerStudentToClass(classId: number, data: RegisterStudentToClassRequest): Promise<string> {
    const response: AxiosResponse<string> = await this.api.post(`/classes/${classId}/register`, data);
    return response.data;
  }

  // Subscription APIs
  async getAllSubscriptions(): Promise<SubscriptionResponse[]> {
    const response: AxiosResponse<SubscriptionResponse[]> = await this.api.get('/subscriptions');
    return response.data;
  }

  async createSubscription(data: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    const response: AxiosResponse<SubscriptionResponse> = await this.api.post('/subscriptions', data);
    return response.data;
  }

  async getSubscriptionById(id: number): Promise<SubscriptionResponse> {
    const response: AxiosResponse<SubscriptionResponse> = await this.api.get(`/subscriptions/${id}`);
    return response.data;
  }
  async useSession(id: number): Promise<SubscriptionResponse> {
    const response: AxiosResponse<SubscriptionResponse> = await this.api.patch(`/subscriptions/${id}/use`);
    return response.data;
  }
}

// Create and export a singleton instance
export const apiClient = new TeenUpApiClient();

// Also export the class for custom instances
export default TeenUpApiClient;
