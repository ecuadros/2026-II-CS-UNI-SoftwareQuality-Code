# language: es
Característica: Conocer el riesgo de mi casa
  Para prepararme antes de que llueva
  como persona que registró su casa
  quiero saber su nivel de riesgo y qué hacer

  Escenario: Un aviso vigente sobre mi distrito sube el riesgo de mi casa
    Dado que "Ana" registró su casa en el distrito "060101"
    Y SENAMHI emitió el aviso "403-2026" vigente con riesgo "ALTO" para el distrito "060101"
    Cuando "Ana" consulta el riesgo de su casa
    Entonces el riesgo es "ALTO" por el aviso "403-2026"
    Y el plan de acción incluye "Aléjate de los cauces de ríos y quebradas"

  Escenario: Un aviso que ya terminó no cuenta
    Dado que "Luis" registró su casa en el distrito "060101"
    Y SENAMHI emitió el aviso "399-2026" que ya terminó con riesgo "MUY_ALTO" para el distrito "060101"
    Cuando "Luis" consulta el riesgo de su casa
    Entonces el riesgo es "BAJO" sin avisos
