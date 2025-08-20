import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const { enunciado } = req.body;
  console.log('Enunciado recibido:', enunciado);


  try {
    // Aquí iría la llamada real a Gemini o tu lógica de generación
    const diagrama = `graph TD
      A[Inicio] --> B{¿Condición?}
      B -- Sí --> C[Acción]
      B -- No --> D[Otra acción]
      C --> E[Fin]
      D --> E`;

    res.json({ diagrama });
  } catch (error) {
    console.error('Error generando diagrama:', error);
    res.status(500).json({ error: 'Error generando diagrama' });
  }
});

export default router;
