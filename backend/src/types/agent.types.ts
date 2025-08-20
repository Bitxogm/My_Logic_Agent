export interface LogicRequest {
  modo: 'statement' | 'diagram' | 'code';
  enunciado: string;
  opciones?: string[];
}

export interface LogicResponse {
  respuesta: string;
  explicacion: string;
  tipo: string;
  nivel: 'fácil' | 'medio' | 'difícil';
}
